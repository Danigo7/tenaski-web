'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import SectionText from '../ui/SectionTest'

type IntroProps = {
  eyebrow: string
  title: string
  description: string
}

export default function Intro({
  eyebrow,
  title,
  description,
}: IntroProps) {
  return (
    <section className="bg-[#0F0F0F] py-10">

      <div className="mx-auto max-w-6xl px-6">

        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#C4A882]">
          {eyebrow}
        </p>

        <SectionTitle>
          {title}
        </SectionTitle>

        <div className="mt-10">
          <SectionText>
            {description}
          </SectionText>
        </div>

      </div>

    </section>
  )
}