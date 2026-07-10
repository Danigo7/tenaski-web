type SectionTextProps = {
  children: React.ReactNode
}

export default function SectionText({
  children,
}: SectionTextProps) {
  return <p className="home-section__text">{children}</p>
}