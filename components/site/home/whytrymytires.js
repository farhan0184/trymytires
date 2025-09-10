"use client";

import Title from "../common/title";

import { useState } from "react";
import { ShieldCheck, Tag, Wrench } from "lucide-react";
import FeatureCard from "./featurecard";
import { useI18n } from "@/app/provider/i18nProvider";
import { columnFormatter } from "@/app/helper/util";



export default function WhyTryMyTires({ faq }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const { langCode,t } = useI18n()

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <main className="container mx-auto mt-8 mb-20 lg:mb-32 md:mt-15">
      <div className="container mt-8 md:mt-15">
        <Title heading={columnFormatter(faq?.title, langCode)} className={""} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5 md:mt-10 ">
        {faq?.list?.map((card, i) => (
          <FeatureCard
            id="trusted-brands"
            key={i}
            icon={card?.image}
            title={columnFormatter(card.title, langCode)}
            description={columnFormatter(card.description, langCode)}
            t={t}
            expandedContent={
              <div className="space-y-4 text-left">
                <p className="font-semibold text-gray-800 md:text-lg">
                  {columnFormatter(card?.feature_title, langCode)}
                </p>
                <ul className="list-disc pl-5 space-y-2  md:text-lg">
                  {card.feature[langCode]?.map((feat, idx) => {
                    const [boldText, ...rest] = feat.split(":");
                    const description = rest.join(":").trim(); // handles extra colons in text
                    return (
                      <li key={idx}>
                        <strong>{boldText.trim()}:</strong> {description}
                      </li>
                    );
                  })}
                </ul>
              </div>
            }
            isExpanded={expandedCard === "trusted-brands"}
            onToggle={() => toggleCard("trusted-brands")}
          />
        ))}
      </div>
    </main>
  );
}
