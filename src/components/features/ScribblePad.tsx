import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Save, Eraser, PenIcon, Trash2, Undo2, FileDown, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface ScribblePadProps {
  patientId: string;
  doctorId: string; // From auth context ideally
  fullScreenMode?: boolean;
  doctorName?: string;
  department?: string;
  onClose?: () => void;
}

const ScribblePad: React.FC<ScribblePadProps> = ({ patientId, doctorId, fullScreenMode = false, doctorName = "DhiGraph Practitioner", department, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [notes, setNotes] = useState('');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  // Hardcode pen lock for true hardware integration (no mouse/minimize clicks)
  const penOnly = true;

  const [history, setHistory] = useState<ImageData[]>([]);
  
  // AI Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiTranscription, setAiTranscription] = useState("");
  const [tempImageData, setTempImageData] = useState("");

  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const newHistory = [...history];
    const previousState = newHistory.pop();
    setHistory(newHistory);
    
    if (previousState) {
        ctx.putImageData(previousState, 0, 0);
    }
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only allow hardware pen, completely block mouse/touch simulation
    if (penOnly && e.pointerType !== 'pen') {
      e.preventDefault();
      return;
    }
    
    setIsDrawing(true);
    saveStateToHistory();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture pointer to track outside bounds
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Detect Huion Pen physical eraser button
    const isPenEraser = e.pointerType === 'pen' && (e.button === 5 || e.buttons === 32);
    const activeTool = isPenEraser ? 'eraser' : tool;

    // Apply realistic pressure sensitivity mapping
    const pressure = e.pressure !== undefined ? e.pressure : 1;
    // Smoother width transition for realistic ink bleeding effect
    const baseWidth = activeTool === 'eraser' ? 30 : 2.5;
    const lineWidthModifier = pressure * 1.5 + 0.5;

    ctx.strokeStyle = activeTool === 'eraser' ? 'rgba(0,0,0,1)' : '#0f172a'; // Ink color (slate-900)
    ctx.lineWidth = baseWidth * lineWidthModifier;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (penOnly && e.pointerType !== 'pen') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const isPenEraser = e.pointerType === 'pen' && (e.button === 5 || e.buttons === 32);
    const activeTool = isPenEraser ? 'eraser' : tool;

    const pressure = e.pressure !== undefined ? e.pressure : 1;
    const baseWidth = activeTool === 'eraser' ? 30 : 2.5;
    const lineWidthModifier = pressure * 1.5 + 0.5;

    ctx.strokeStyle = activeTool === 'eraser' ? 'rgba(0,0,0,1)' : '#0f172a';
    ctx.lineWidth = baseWidth * lineWidthModifier;
    ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.releasePointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    saveStateToHistory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveScribble = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL('image/png');

    try {
      // Assuming a backend API running on same origin or properly proxied
      const res = await fetch('http://localhost:5000/api/scribbles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId, image_data: imageData, notes })
      });
      if (!res.ok) throw new Error('Failed to save scribble');
      toast.success('Scribble saved successfully!');
      clearCanvas();
      setNotes('');
      } catch (err) {
      toast.error('Could not save scribble');
    }
  };

  const analyzeAndPreview = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAnalyzing(true);
    toast.info("Analyzing handwriting with Gemini AI... Please wait.");
    
    // Create a temporary solid background canvas for export, as eraser uses transparency
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext("2d");
    if (!expCtx) {
      setIsAnalyzing(false);
      return;
    }
    
    // Fill white background
    expCtx.fillStyle = "#ffffff";
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    // Draw the actual drawing on top
    expCtx.drawImage(canvas, 0, 0);

    const imageData = exportCanvas.toDataURL('image/png');
    setTempImageData(imageData);
    
    // Call our backend to transcribe the image via Gemini
    try {
      const transcribeRes = await fetch('http://localhost:5000/api/ai/transcribe-scribble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_data: imageData })
      });
      if (transcribeRes.ok) {
        const data = await transcribeRes.json();
        setAiTranscription(data.transcription || "No readable handwriting detected.");
        setIsPreviewOpen(true);
      } else {
        toast.error("Handwriting AI transcription failed.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      toast.error("Could not reach AI transcription service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadFinalPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const doc = new jsPDF();
    
    // Header Branding
    doc.setFontSize(16);
    doc.text("Adichunchanagiri Ayurveda Medical College", 20, 20);
    doc.setFontSize(10);
    doc.text("Hospital & Research Centre", 20, 26);
    doc.setFontSize(9);
    doc.text("Powered by DhiGraph", 160, 20);

    doc.setFontSize(14);
    doc.text(`Clinical Case Sheet - ${department || 'General'}`, 20, 40);
    
    doc.setFontSize(11);
    doc.text(`Doctor: ${doctorName}`, 20, 50);
    doc.text(`Patient ID: ${patientId}`, 20, 58);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 66);

    // Calculate proportional dimensions holding exact aspect ratio
    const imgRatio = canvas.height / canvas.width;
    const maxPdfImageWidth = 170;
    const maxPdfImageHeight = 280 - 150; // Leave MORE bottom margin for AI text
    
    let renderedWidth = maxPdfImageWidth;
    let renderedHeight = renderedWidth * imgRatio;

    // Scale back if height breaks page boundary
    if (renderedHeight > maxPdfImageHeight) {
        renderedHeight = maxPdfImageHeight;
        renderedWidth = renderedHeight / imgRatio;
    }

    // Embed proportional canvas image, horizontally center it if scaled down
    const xOffset = 20 + (maxPdfImageWidth - renderedWidth) / 2;
    doc.addImage(tempImageData, 'PNG', xOffset, 75, renderedWidth, renderedHeight);
    
    let currentY = 75 + renderedHeight + 10;
    
    if (notes) {
      doc.setFont("helvetica", "bold");
      doc.text("Typed Clinical Notes:", 20, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 8;
      const splitNotes = doc.splitTextToSize(notes, 170);
      doc.text(splitNotes, 20, currentY);
      currentY += (splitNotes.length * 7) + 5;
    }

    if (aiTranscription) {
      doc.setFont("helvetica", "bold");
      doc.text("AI Transcribed Notes (Gemini 1.5):", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      currentY += 8;
      const splitTranscription = doc.splitTextToSize(aiTranscription, 170);
      // Check if we need a new page
      if (currentY + (splitTranscription.length * 6) > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(splitTranscription, 20, currentY);
    }
    
    doc.save(`CaseStudy_${patientId}_${Date.now()}.pdf`);
    toast.success("Case Study PDF with AI Transcription Downloaded");
    setIsPreviewOpen(false);
  };

  // Define dynamic sizes
  const canvasInternalHeight = fullScreenMode ? 2500 : 400;
  const canvasInternalWidth = fullScreenMode ? 1200 : 800;

  return (
    <Card className={`w-full ${fullScreenMode ? 'fixed inset-0 z-[9999] w-screen h-[100dvh] rounded-none border-0 shadow-none bg-white flex flex-col overflow-hidden' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between shrink-0 bg-white border-b sticky top-0 z-10 p-4">
         <CardTitle className="text-xl font-display flex items-center gap-3">
           <img src="/logo.png" alt="Hospital Logo" className="w-8 h-8 rounded-full border border-slate-200" />
           <span className="text-slate-800">{fullScreenMode ? `${department ? department + ' Case Sheet' : 'Case Study Records'}` : `Case Sheet`} - AAMCHRC</span>
           <div className="flex items-center ml-4 pl-4 border-l border-slate-200 text-slate-500 gap-2">
             <Brain className="w-5 h-5 text-primary" />
             <span className="text-sm uppercase font-extrabold tracking-widest text-primary drop-shadow-sm">DhiGraph</span>
           </div>
         </CardTitle>
        <div className="flex items-center gap-4">
           {fullScreenMode && (
             <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-semibold hidden md:flex items-center gap-2">
               {department && <span className="text-muted-foreground mr-2 font-medium">{department}</span>}
               {doctorName}
             </div>
           )}
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-500 font-medium text-xs">
             <PenIcon className="w-3 h-3" /> Hardware Pen Locked
           </div>
           {onClose && (
             <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl ml-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
               Minimize Sheet
             </Button>
           )}
        </div>
      </CardHeader>
      <CardContent className={`space-y-0 ${fullScreenMode ? 'p-0 flex-1 flex flex-col min-h-0 bg-slate-100/50' : ''}`}>
        
        {/* Unobtrusive Top Action Bar for Immediate Visibility */}
        <div className="flex flex-wrap gap-4 justify-between items-center shrink-0 px-6 py-3 bg-white border-b border-slate-200 z-20 w-full relative drop-shadow-sm">
          <div className="flex gap-2">
            <Button 
              variant={tool === 'pen' ? 'default' : 'outline'} 
              onClick={() => setTool('pen')}
              className={tool === 'pen' ? 'bg-slate-800 text-white rounded-xl' : 'rounded-xl'}
            >
              <PenIcon className="w-4 h-4 mr-2" />
              Ink Pen
            </Button>
            <Button 
              variant={tool === 'eraser' ? 'default' : 'outline'} 
              onClick={() => setTool('eraser')}
              className={tool === 'eraser' ? 'bg-slate-800 text-white rounded-xl' : 'rounded-xl'}
            >
              <Eraser className="w-4 h-4 mr-2" />
              Eraser
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={undo}
              disabled={history.length === 0}
              className="rounded-xl"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Undo Stroke
            </Button>
            <Button variant="outline" onClick={clearCanvas} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Sheet
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={analyzeAndPreview} disabled={isAnalyzing} className="rounded-xl">
              {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
              {isAnalyzing ? "Analyzing..." : "Download PDF"}
            </Button>
            <Button onClick={saveScribble} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              Commit Case Study
            </Button>
          </div>
        </div>

        {/* Scrollable Container for Infinite Space with Authentic Pad Styling */}
        <div className={`overflow-y-auto overflow-x-auto ${fullScreenMode ? 'flex-1 h-full w-full p-4 md:p-6 flex justify-center' : 'border border-slate-200 rounded-bl-xl rounded-br-xl'}`}>
          <div className={`${fullScreenMode ? 'w-full rounded-sm overflow-hidden border border-slate-200 shadow-xl' : 'w-full'} bg-white relative`}>
            
            {/* Realistic pad binding effect */}
            {fullScreenMode && (
              <div className="h-6 w-full bg-slate-800 flex items-center justify-around px-8">
                 <div className="w-8 h-2 bg-slate-600 rounded-full"></div>
                 <div className="w-8 h-2 bg-slate-600 rounded-full"></div>
                 <div className="w-8 h-2 bg-slate-600 rounded-full"></div>
                 <div className="w-8 h-2 bg-slate-600 rounded-full"></div>
                 <div className="w-8 h-2 bg-slate-600 rounded-full"></div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={canvasInternalWidth}
              height={canvasInternalHeight}
              style={{ 
                touchAction: 'none', 
                height: `${canvasInternalHeight}px`,
                width: '100%',
                backgroundColor: '#fdfdfa',
                backgroundImage: 'linear-gradient(90deg, transparent 79px, #ef4444 79px, #ef4444 81px, transparent 81px), repeating-linear-gradient(transparent, transparent 31px, #cbd5e1 31px, #cbd5e1 32px)',
                backgroundAttachment: 'local',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
              }}
              className="cursor-crosshair block"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            onPointerCancel={stopDrawing}
          />
          </div>
        </div>
      </CardContent>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl border-0 shadow-2xl rounded-2xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Review AI Transcription
            </DialogTitle>
            <DialogDescription className="text-base font-medium text-slate-500">
              The AI has converted your handwritten notes into text. You can edit or append to it below using your keyboard before downloading the final PDF.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-2">
            <textarea
              className="w-full min-h-[300px] p-5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y select-text shadow-inner"
              value={aiTranscription}
              onChange={(e) => setAiTranscription(e.target.value)}
              placeholder="AI Transcription will appear here. You can manually type or edit..."
              spellCheck="false"
            />
          </div>

          <DialogFooter className="mt-2 flex gap-3 sm:justify-between items-center w-full">
            <p className="text-xs text-slate-400 font-medium hidden sm:block">* Editing here updates the downloaded PDF layout directly.</p>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="rounded-xl font-semibold">
                Cancel
                </Button>
                <Button onClick={downloadFinalPdf} className="bg-primary text-white hover:bg-primary/90 rounded-xl font-bold shadow-lg w-full sm:w-auto">
                <FileDown className="w-4 h-4 mr-2" /> Download Final PDF
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScribblePad;
