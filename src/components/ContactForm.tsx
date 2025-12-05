import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg">
          Message envoyé avec succès ! Nous vous répondrons bientôt.
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Nom complet
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Votre nom"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="votre@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Sujet
        </label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="De quoi souhaitez-vous parler ?"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Votre message..."
          rows={6}
          required
        />
      </div>

      <Button 
        type="submit"
        size="lg"
        className="w-full gradient-primary text-primary-foreground shadow-soft hover:shadow-medium transition-smooth"
      >
        Envoyer le message
        <Send className="ml-2 h-5 w-5" />
      </Button>
    </form>
  );
};

export default ContactForm;
