import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ProductVariant } from '@/backend';

interface ProductVariantPickerProps {
  variants: ProductVariant[];
  selectedVariantId: bigint | null;
  onSelect: (variantId: bigint) => void;
}

export default function ProductVariantPicker({
  variants,
  selectedVariantId,
  onSelect,
}: ProductVariantPickerProps) {
  const activeVariants = variants.filter((v) => v.isActive && v.inStock);

  if (activeVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Select Size</Label>
      <RadioGroup
        value={selectedVariantId?.toString() || ''}
        onValueChange={(value) => onSelect(BigInt(value))}
      >
        <div className="space-y-2">
          {activeVariants.map((variant) => (
            <div
              key={variant.id.toString()}
              className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onSelect(variant.id)}
            >
              <RadioGroupItem value={variant.id.toString()} id={variant.id.toString()} />
              <Label
                htmlFor={variant.id.toString()}
                className="flex-1 flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium">{variant.name}</span>
                <span className="text-primary font-semibold">₹{variant.price.toFixed(2)}</span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
