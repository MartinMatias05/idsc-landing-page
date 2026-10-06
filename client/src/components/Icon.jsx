import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ClipboardList,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Phone,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';

/** Lucide icons used by the design, addressable by the names the API sends (`icon: "megaphone"`). */
const ICONS = {
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'chevron-down': ChevronDown,
  'clipboard-list': ClipboardList,
  'clock-3': Clock3,
  'graduation-cap': GraduationCap,
  mail: Mail,
  'map-pin': MapPin,
  megaphone: Megaphone,
  menu: Menu,
  phone: Phone,
  search: Search,
  'shield-alert': ShieldAlert,
  x: X,
};

/** Unknown names from the API fall back to the megaphone used by the notice cards. */
export default function Icon({ name, size = 20, ...rest }) {
  const Component = ICONS[name] ?? Megaphone;
  return <Component size={size} aria-hidden="true" focusable="false" {...rest} />;
}
