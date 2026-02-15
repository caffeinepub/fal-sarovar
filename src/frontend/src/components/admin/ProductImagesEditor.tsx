import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { ExternalBlob } from '@/backend';
import { fileToExternalBlob, urlToExternalBlob, getBlobPreviewUrl } from '@/utils/blob';

interface ProductImagesEditorProps {
  images: ExternalBlob[];
  onChange: (images: ExternalBlob[]) => void;
}

export default function ProductImagesEditor({ images, onChange }: ProductImagesEditorProps) {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const blob = await fileToExternalBlob(file);
      onChange([...images, blob]);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const blob = urlToExternalBlob(urlInput.trim());
    onChange([...images, blob]);
    setUrlInput('');
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>Product Images</Label>
      
      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
              <img
                src={getBlobPreviewUrl(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload controls */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Label htmlFor="image-upload">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </span>
            </Button>
          </Label>
        </div>
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
        />
        <Button type="button" variant="outline" onClick={handleAddUrl} disabled={!urlInput.trim()}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
