
interface TeamRequirementsBadgesProps {
  totalPhotographers: number;
  totalVideographers: number;
  requiredPhotographers: number;
  requiredVideographers: number;
}

export function TeamRequirementsBadges({ 
  totalPhotographers, 
  totalVideographers, 
  requiredPhotographers, 
  requiredVideographers 
}: TeamRequirementsBadgesProps) {
  const photographersMatch = totalPhotographers === requiredPhotographers;
  const videographersMatch = totalVideographers === requiredVideographers;
  
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
        photographersMatch ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {totalPhotographers}/{requiredPhotographers} Photographers
      </div>
      <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
        videographersMatch ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {totalVideographers}/{requiredVideographers} Videographers
      </div>
    </div>
  );
}
