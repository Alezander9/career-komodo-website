export interface Opportunity {
  name: string;
  description: string;
}

export function parseOpportunities(text: string): Opportunity[] {
  const opportunities: Opportunity[] = [];
  
  // Split by "Name: " to get each opportunity section
  const sections = text.split(/\nName: /);
  
  // Skip the first empty section if it exists
  const startIndex = sections[0].trim() === '' ? 1 : 0;
  
  for (let i = startIndex; i < sections.length; i++) {
    const section = sections[i];
    if (!section.trim()) continue;

    // Extract name (everything before the first newline)
    const nameEndIndex = section.indexOf('\n');
    if (nameEndIndex === -1) continue;
    
    const name = section.substring(0, nameEndIndex).trim();
    
    // Extract description (everything after "Description: ")
    const descriptionStart = section.indexOf('Description: ');
    if (descriptionStart === -1) continue;
    
    const description = section.substring(descriptionStart + 'Description: '.length).trim();

    opportunities.push({
      name,
      description
    });
  }

  return opportunities;
} 