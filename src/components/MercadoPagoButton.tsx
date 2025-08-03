import React from "react";
import CheckoutButton from "./CheckoutButton";

interface MercadoPagoButtonProps {
  children: React.ReactNode;
  className?: string;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ 
  children, 
  className 
}) => {
  return (
    <CheckoutButton className={className}>
      {children}
    </CheckoutButton>
  );
};

export default MercadoPagoButton;
