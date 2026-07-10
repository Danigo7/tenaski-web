type SectionTitleProps = {
  children: React.ReactNode
}

export default function SectionTitle({
  children,
}: SectionTitleProps) {
  return <h2 className="home-section__title">{children}</h2>
}