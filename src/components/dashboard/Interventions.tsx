import React from 'react';
import { StudentSummary } from '../../features/management/managementSlice';

interface InterventionsProps {
  students: StudentSummary[];
}

export const Interventions: React.FC<InterventionsProps> = ({ students }) => {
  const studentsNeedingSupport = students
    .filter(student => student.overallProgress < 60)
    .map(student => ({
      ...student,
      weakAreas: [
        ...student.subjects.english.areasForImprovement,
        ...student.subjects.mathematics.areasForImprovement
      ]
    }))
    .sort((a, b) => a.overallProgress - b.overallProgress);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Intervention Recommendations
      </h2>

      {studentsNeedingSupport.length === 0 ? (
        <p className="text-gray-600">
          No students currently require intervention.
        </p>
      ) : (
        <div className="space-y-6">
          {studentsNeedingSupport.map(student => (
            <div
              key={student.id}
              className="border border-red-200 rounded-lg p-4 bg-red-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-600">Year {student.yearGroup}</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {student.overallProgress}%
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Areas Needing Support:</h4>
                <ul className="text-sm space-y-1">
                  {student.weakAreas.map((area, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-red-500">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  Schedule Meeting
                </button>
                <button className="px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md text-sm hover:bg-blue-50">
                  Create Action Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 
