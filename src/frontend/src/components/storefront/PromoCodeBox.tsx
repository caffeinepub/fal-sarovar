import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useValidatePromoCode } from '@/hooks/queries/usePromoCodes';
import { CheckCircle2, XCircle, Tag } from 'lucide-react';
import type { PromoCode } from '@/backend';

interface PromoCodeBoxProps {
  orderAmount: number;
  onPromoApplied: (promo: PromoCode | null) => void;
}

export default function PromoCodeBox({ orderAmount, onPromoApplied }: PromoCodeBoxProps) {
  const [code, setCode] = useState('');
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  
  const validateMutation = useValidatePromoCode();

  const handleValidate = async () => {
    if (!code.trim()) return;

    try {
      const result = await validateMutation.mutateAsync({ code: code.trim(), orderAmount });
      
      if (result) {
        setValidationState('valid');
        setAppliedPromo(result);
        onPromoApplied(result);
        setErrorMessage('');
      } else {
        setValidationState('invalid');
        setAppliedPromo(null);
        onPromoApplied(null);
        setErrorMessage('Invalid, expired, or minimum order value not met');
      }
    } catch (error) {
      setValidationState('invalid');
      setAppliedPromo(null);
      onPromoApplied(null);
      setErrorMessage('Failed to validate promo code');
    }
  };

  const handleRemove = () => {
    setCode('');
    setValidationState('idle');
    setAppliedPromo(null);
    onPromoApplied(null);
    setErrorMessage('');
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="promo-code" className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Promo Code
      </Label>
      <div className="flex gap-2">
        <Input
          id="promo-code"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={validationState === 'valid'}
        />
        {validationState === 'valid' ? (
          <Button variant="outline" onClick={handleRemove}>
            Remove
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleValidate}
            disabled={!code.trim() || validateMutation.isPending}
          >
            {validateMutation.isPending ? 'Checking...' : 'Apply'}
          </Button>
        )}
      </div>

      {validationState === 'valid' && appliedPromo && (
        <Alert className="border-primary bg-primary/5">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            Promo code applied! You save ₹
            {appliedPromo.discountType.__kind__ === 'flat'
              ? appliedPromo.discountType.flat.toFixed(2)
              : ((orderAmount * appliedPromo.discountType.percentage) / 100).toFixed(2)}
          </AlertDescription>
        </Alert>
      )}

      {validationState === 'invalid' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
