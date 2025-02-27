import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import WidgetCodeGenerator from './WidgetCodeGenerator';

interface WidgetScriptProps {
  userId: string;
}

const WidgetScript: React.FC<WidgetScriptProps> = ({ userId }) => {
  return <WidgetCodeGenerator userId={userId} />;
};

export default WidgetScript;