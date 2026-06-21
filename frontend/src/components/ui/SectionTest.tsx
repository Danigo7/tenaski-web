type SectionTextProps = {
  children: React.ReactNode
}

export default function SectionText({
  children,
}: SectionTextProps) {
  return (
    <p
      className="
        max-w-lg
        text-base
        leading-relaxed
        text-[#E8E4DC]/60
        sm:text-lg
      "
    >
      {children}
    </p>
  )
}