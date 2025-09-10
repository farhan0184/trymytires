"use client";
import { useI18n } from "@/app/provider/i18nProvider";
import { MultiLangArrayInput } from "@/components/admin/multiLangArrayInput";
import { MultiLangInput } from "@/components/admin/multiLangInput";
import AboutPage from "@/components/admin/page/about_page";
import ContactPage from "@/components/admin/page/contact";
import SnapFinancePage from "@/components/admin/page/finance";
import HomePage from "@/components/admin/page/home_page";
import ProductsData from "@/components/admin/page/products";
import ProgramsPage from "@/components/admin/page/program_page";
import TabsContent from "@/components/admin/page/tab_layout";
import TermsAndConditions from "@/components/admin/page/terms_and_conditions_page";
import MultipleImageInput from "@/components/commons/multipleImageInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

export default function PageSettings() {
  const [activeTab, setActiveTab] = useState("home_page");
  const tabs = [
    { slug: "home_page", title: "Home Page" },
    { slug: "products", title: "Products Page" },
    { slug: "programs", title: "Programs Page" },
    { slug: "contact_page", title: "Contact Page" },
    { slug: "about_page", title: "About Page" },
    { slug: "finance_page", title: "Finance Page" },
    { slug: "terms_and_conditions_page", title: "Terms And Conditions" },
  ];
  const i18n = useI18n();
  let { languages, langCode } = i18n;
  const [selectedLang, setSelectedLang] = useState("");

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  
  return (
    <div className="relative grid lg:grid-cols-4 grid-cols-1 gap-5">
      <div className="flex flex-col space-y-3 lg:col-span-1 sticky top-0">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            className={` px-4 py-2 rounded-lg cursor-pointer ${activeTab === tab.slug
              ? "bg-gradient-to-r from-secondary-foreground to-secondary text-white"
              : "bg-white text-black border border-gray-300"
              } font-bold subtitleText`}
            onClick={() => setActiveTab(tab.slug)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="lg:col-span-3 col-span-1  ">
        {activeTab === "home_page" && (
         <HomePage languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang} />
        )}
        {activeTab === "products" && <ProductsData languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang}/>}
        {activeTab === "programs" && <ProgramsPage languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang}/>}
        {activeTab === "contact_page" && <ContactPage languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang}/>}
        {activeTab === "about_page" && <AboutPage languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang}/>}
        {activeTab === "finance_page" && <SnapFinancePage languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang}/>}
        {activeTab === "terms_and_conditions_page" && <TermsAndConditions languages={languages} setSelectedLang={setSelectedLang} selectedLang={selectedLang}/>}

      </div>
    </div>
  );
}






