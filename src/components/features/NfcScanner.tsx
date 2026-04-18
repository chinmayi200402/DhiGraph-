import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Nfc, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NfcScannerProps {
  onPatientFound: (patient: any) => void;
}

const NfcScanner: React.FC<NfcScannerProps> = ({ onPatientFound }) => {
  const [scanning, setScanning] = useState(false);

  const startScan = async () => {
    setScanning(true);
    
    // Simulate Web NFC API for desktop/browsers that don't support it
    if ('NDEFReader' in window) {
      try {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.addEventListener("reading", async ({ message, serialNumber }: any) => {
          toast.success(`NFC Tag detected: ${serialNumber}`);
          await fetchPatientByNfc(serialNumber);
        });
      } catch (error) {
        toast.error("NFC Scan error: " + error);
        setScanning(false);
      }
    } else {
      // Simulation for development
      toast.info("Simulating NFC Scan in 2 seconds...");
      setTimeout(() => {
        fetchPatientByNfc('SIMULATED_TAG_123');
      }, 2000);
    }
  };

  const fetchPatientByNfc = async (tagId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/nfc/${tagId}`);
      if (!res.ok) {
        throw new Error('Patient not found');
      }
      const data = await res.json();
      toast.success(`Patient matched: ${data.name}`);
      onPatientFound(data);
    } catch (err) {
      toast.error('Unregistered NFC Card or API error');
    } finally {
      setScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Nfc className="w-5 h-5" />
          NFC Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-6">
        {scanning ? (
          <div className="flex flex-col items-center gap-4 text-gray-500 animate-pulse">
            <Loader2 className="w-12 h-12 animate-spin text-ayur-600" />
            <p>Scanning for NFC Card...</p>
          </div>
        ) : (
          <Button onClick={startScan} className="w-full max-w-sm h-16 text-lg">
            <Nfc className="w-6 h-6 mr-2" />
            Start NFC Scan
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NfcScanner;
