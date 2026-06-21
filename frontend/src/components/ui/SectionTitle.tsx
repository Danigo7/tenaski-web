type SectionTitleProps = {
  children: React.ReactNode
}

export default function SectionTitle({
  children,
}: SectionTitleProps) {
  return (
    <h2
      className="
        max-w-2xl
        font-['Cormorant_Garamond']
        text-5xl
        font-light
        leading-[1]
        tracking-[-0.03em]
        text-[#E8E4DC]
        md:text-6xl
      "
    >
      {children}
    </h2>
  )
}