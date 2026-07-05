import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does a project take?",
    answer:
      "Depending on project complexity, usually between 2-8 weeks.",
  },
  {
    question: "Do you provide support after delivery?",
    answer:
      "Yes. We provide maintenance and long-term technical support.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely. We modernize existing websites with better UI/UX and performance.",
  },
  {
    question: "Do you build mobile apps?",
    answer:
      "Yes, we develop Android, iOS, and cross-platform applications.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-slate-950 py-24 px-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-center text-5xl font-bold text-white mb-16">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (

          <div
            key={index}
            className="mb-5 bg-slate-900 rounded-xl border border-slate-800"
          >

            <button
              onClick={() =>
                setOpen(open === index ? null : index)
              }
              className="w-full flex justify-between items-center p-6 text-white"
            >
              {faq.question}

              <ChevronDown
                className={`transition ${
                  open === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {open === index && (
              <div className="px-6 pb-6 text-slate-400">
                {faq.answer}
              </div>
            )}

          </div>

        ))}

      </div>

    </section>
  );
}