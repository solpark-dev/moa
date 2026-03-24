// src/components/common/Header.jsx
import { useHeaderLogic } from "@/hooks/common/useHeader";
import HeaderView from "@/components/common/HeaderView";

export default function Header() {
  const props = useHeaderLogic();
  return <HeaderView {...props} />;
}
