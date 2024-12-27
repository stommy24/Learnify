interface Props {
  objectives: {
    id: string;
    description: string;
    mastery: number;
  }[];
}

export function ObjectiveMasteryGrid({ objectives }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {objectives.map(objective => (
        <div 
          key={objective.id}
          className={`
            p-4 rounded-lg border
            ${objective.mastery >= 85 ? 'bg-green-50 border-green-200' : 
              objective.mastery >= 50 ? 'bg-yellow-50 border-yellow-200' : 
              'bg-red-50 border-red-200'}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm flex-1">{objective.description}</p>
            <span className={`
              ml-2 px-2 py-1 rounded-full text-xs font-medium
              ${objective.mastery >= 85 ? 'bg-green-100 text-green-800' :
                objective.mastery >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}
            `}>
              {objective.mastery}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                objective.mastery >= 85 ? 'bg-green-500' :
                objective.mastery >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${objective.mastery}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
} 