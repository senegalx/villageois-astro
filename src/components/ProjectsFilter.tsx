import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";

const projects = [
  {
    title: "Maison Digitale de Labé",
    location: "Labé, Guinée",
    date: "2023 - En cours",
    status: "Actif",
    category: "Alphabétisation numérique",
    description: "Centre de formation en alphabétisation numérique offrant des cours gratuits en informatique de base, bureautique et Internet aux jeunes et adultes de la région.",
    impact: "500+ personnes formées",
    beneficiaries: "Jeunes, femmes, étudiants"
  },
  {
    title: "Programme GuineeCheck",
    location: "National",
    date: "2024 - En cours",
    status: "Actif",
    category: "Lutte contre la désinformation",
    description: "Partenariat avec GuineeCheck pour former des journalistes et citoyens au fact-checking et à la vérification des informations en ligne.",
    impact: "100+ articles de vérification publiés",
    beneficiaries: "Journalistes, médias, citoyens"
  },
  {
    title: "Participation Citoyenne 2.0",
    location: "Conakry",
    date: "2024 - En cours",
    status: "Actif",
    category: "Participation citoyenne",
    description: "Programme d'engagement civique utilisant les outils numériques pour faciliter le dialogue entre citoyens et autorités locales.",
    impact: "200+ participants aux forums",
    beneficiaries: "Citoyens, société civile"
  },
  {
    title: "Éducation Civique Multilingue",
    location: "National",
    date: "2025 - Planifié",
    status: "Planifié",
    category: "Éducation citoyenne et populaire",
    description: "Développement de contenus d'éducation civique en langues locales (pular, malinké) pour atteindre les communautés rurales.",
    impact: "Objectif: 20% de public rural",
    beneficiaries: "Communautés rurales"
  },
  {
    title: "TechCamp Guinée",
    location: "Conakry",
    date: "2024",
    status: "Complété",
    category: "Lutte contre la désinformation",
    description: "Atelier intensif de quatre jours sur la désinformation et l'intégrité de l'information organisé avec l'Ambassade des États-Unis.",
    impact: "50 participants formés",
    beneficiaries: "Journalistes, blogueurs, activistes"
  },
  {
    title: "Projet Renfort",
    location: "Labé",
    date: "2025 - En cours",
    status: "Actif",
    category: "Lutte contre la désinformation",
    description: "Renforcement des capacités sur l'intégrité de l'information et la prévention des discours discriminatoires.",
    impact: "100+ candidatures reçues",
    beneficiaries: "Acteurs médiatiques, société civile"
  }
];

const categories = [
  "Tous",
  "Alphabétisation numérique",
  "Lutte contre la désinformation",
  "Participation citoyenne",
  "Éducation citoyenne et populaire"
];

export const ProjectsFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  
  const filteredProjects = selectedCategory === "Tous" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <>
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "border-2 hover:border-primary"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredProjects.map((project, index) => (
              <div 
                key={index}
                className="border-2 hover:shadow-medium transition-smooth rounded-lg bg-card"
              >
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant={project.status === "Actif" ? "default" : project.status === "Complété" ? "secondary" : "outline"}
                      className={project.status === "Actif" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3 w-fit">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2">{project.title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{project.date}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-foreground text-sm">Impact:</span>
                      <span className="text-sm text-muted-foreground">{project.impact}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span className="text-sm text-muted-foreground">{project.beneficiaries}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectsFilter;
