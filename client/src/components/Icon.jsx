import * as Icons from 'lucide-react';

export default function Icon({ name = 'CircleHelp', size = 20, strokeWidth = 2, ...props }) {
  const Component = Icons[name] || Icons.CircleHelp;
  return <Component size={size} strokeWidth={strokeWidth} {...props} />;
}
