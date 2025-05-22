import { PageContainer, MainContent, Card } from "@/components/layout";
import { H1, H2, P } from "@/components/ui/typography";

export function FAQPage() {
  const faqs = [
    {
      question: "What is Career Komodo?",
      answer: "Career Komodo is an AI-powered platform that helps you explore career paths and alternatives to traditional four-year college education. We provide personalized guidance and resources to help you navigate your career journey."
    },
    {
      question: "How does the Star Map work?",
      answer: "The Star Map is an interactive visualization of different career paths and their relationships. It helps you understand how different roles connect and what skills you need to progress in your chosen path."
    },
    {
      question: "What is Komodo Text?",
      answer: "Komodo Text is our AI assistant that can answer your questions about careers, provide personalized advice, and help you explore different career options."
    },
    {
      question: "Is Career Komodo free to use?",
      answer: "Yes, Career Komodo is completely free to use. We believe in making career guidance accessible to everyone."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for an account and you'll have access to all our features, including the Star Map, Komodo Text, and our comprehensive career resources."
    }
  ];

  return (
    <PageContainer>
      <MainContent>
        <div className="max-w-3xl mx-auto">
          <H1 className="text-center mb-8">Frequently Asked Questions</H1>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <H2 className="mb-4">{faq.question}</H2>
                <P>{faq.answer}</P>
              </Card>
            ))}
          </div>
        </div>
      </MainContent>
    </PageContainer>
  );
} 