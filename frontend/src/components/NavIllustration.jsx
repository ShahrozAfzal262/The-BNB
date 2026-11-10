export function BrandMark() {
  return (
    <svg className="brand-mark-art" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path d="M7 25.5C7 17.2 13.7 10.5 22 10.5s15 6.7 15 15-6.7 15-15 15S7 33.8 7 25.5Z" fill="#E6F3F0" />
      <path d="M13 25.5c0-5 4-9 9-9s9 4 9 9" stroke="#168476" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M8 28.5c4.8 0 6.5 3 10 3s5.2-3 9-3 5.2 3 9 3" stroke="#168476" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M9 35.5c4.7 0 6.1 2.5 9.5 2.5s5.2-2.5 9-2.5 5.1 2.5 8.5 2.5" stroke="#E3A752" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32.5" cy="10" r="5.5" fill="#F2BD62" />
      <path d="M32.5 2v3M40.5 10h-3M37.9 4.6l-2.1 2.1" stroke="#E3A752" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function NavIllustration({ type }) {
  if (type === "all") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="23" cy="22" r="15.5" fill="#E5B86C" stroke="#80643B" strokeWidth="1.7" />
        <path d="M9 19h27M10.5 27h25M23 6.5c4 4.3 5.9 9.5 5.9 15.5S27 33.2 23 37.5c-4-4.3-5.9-9.5-5.9-15.5S19 10.8 23 6.5Z" stroke="#66827A" strokeWidth="1.55" />
        <path d="M35 9c5 0 7 3 6 6-1 4-6 7-11 5-3-1-3-5-1-8 1.4-2 3.2-3 6-3Z" fill="#94AE7D" stroke="#617C57" strokeWidth="1.4" />
        <path d="M30 18c2-3 4-5 8-7" stroke="#667C56" strokeWidth="1.4" />
      </svg>
    );
  }

  if (type === "homes") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="m7 21 16-13 17 13v19H7V21Z" fill="#E8EEE4" stroke="#465653" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m5 21 18-15 18 15" stroke="#40504C" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 8V5h6v8" stroke="#40504C" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 40V26h11v14" fill="#D9A36E" stroke="#735A42" strokeWidth="1.6" />
        <circle cx="36" cy="29" r="3" fill="#E8B972" />
      </svg>
    );
  }

  if (type === "hotels") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M15 17c0-5.5 4-9 9-9s9 3.5 9 9" stroke="#A57A43" strokeWidth="2" />
        <path d="M13 18h22l2 24H11l2-24Z" fill="#E9C98B" stroke="#856845" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M16 22h16v13H16z" fill="#FCF6E8" stroke="#9A8059" strokeWidth="1.4" />
        <path d="M20 22v13m8-13v13" stroke="#C19559" strokeWidth="1.3" />
        <circle cx="24" cy="16" r="2" fill="#E35D68" />
        <path d="M20 28h8M24 24v9" stroke="#A37743" strokeWidth="1.3" />
      </svg>
    );
  }

  if (type === "experiences") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 4c-9 0-15 7-15 15 0 7 6.3 12 11 15h8c4.7-3 11-8 11-15C39 11 33 4 24 4Z" fill="#E8A450" stroke="#875B39" strokeWidth="1.7" />
        <path d="M24 5v27M14 9c3 2 5 5 5 9s-2 7-5 9m20-18c-3 2-5 5-5 9s2 7 5 9" stroke="#FFF1D8" strokeWidth="2" />
        <path d="M20 34h8l-1 4h-6l-1-4Z" fill="#B9844B" stroke="#704D33" strokeWidth="1.5" />
        <path d="M21 39h6l2 4H19l2-4Z" fill="#8B6544" stroke="#654A37" strokeWidth="1.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 28c.5-2.8 2.8-4.6 6.5-5.6 1.2-.3 2.2-1.6 2.2-3.1a3.3 3.3 0 0 1 6.6 0c0 1.5 1 2.8 2.2 3.1 3.7 1 6 2.8 6.5 5.6H12Z" fill="#C5D0D0" stroke="#596667" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 30h28c-.6 4-4.1 6.5-9 6.5h-10c-4.9 0-8.4-2.5-9-6.5Z" fill="#E9ECE8" stroke="#596667" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M23 13c-1-2 1-3.2 0-5m3 5c-1-2 1-3.2 0-5" stroke="#91A0A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 40h12" stroke="#8A6C4D" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
