import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const ExportReport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [showOptions, setShowOptions] = useState(false);

  const {
    studentAnalytics,
    classAnalytics,
    selectedTimeRange,
    selectedSubjects
  } = useAppSelector(state => state.analytics);

  const generateExcelReport = () => {
    const workbook = XLSX.utils.book_new();

    // Class Overview Sheet
    const classOverviewData = [
      ['Class Performance Overview'],
      ['Average Score', `${classAnalytics.averageScore}%`],
      ['Attendance Rate', `${classAnalytics.attendanceRate}%`],
      ['Completion Rate', `${classAnalytics.completionRate}%`],
      [],
      ['Subject Performance'],
      ['Subject', 'Average', 'Improvement'],
      ...selectedSubjects.map(subject => [
        subject,
        `${classAnalytics.subjectPerformance[subject]?.average}%`,
        `${classAnalytics.subjectPerformance[subject]?.improvement}%`
      ])
    ];

    const classSheet = XLSX.utils.aoa_to_sheet(classOverviewData);
    XLSX.utils.book_append_sheet(workbook, classSheet, 'Class Overview');

    // Student Performance Sheet
    const studentData = [
      ['Student Performance'],
      ['Name', 'Average Score', 'Attendance', 'Completion Rate', 'Improvement'],
      ...Object.values(studentAnalytics).map(student => [
        student.name,
        `${student.averageScore}%`,
        `${student.attendance}%`,
        `${student.completionRate}%`,
        `${student.improvement}%`
      ])
    ];

    const studentSheet = XLSX.utils.aoa_to_sheet(studentData);
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Student Performance');

    // Save the file
    const fileName = `class-analytics-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const generateCSVReport = () => {
    // Convert student data to CSV
    const studentRows = Object.values(studentAnalytics).map(student => ({
      Name: student.name,
      'Average Score': `${student.averageScore}%`,
      Attendance: `${student.attendance}%`,
      'Completion Rate': `${student.completionRate}%`,
      Improvement: `${student.improvement}%`,
      Strengths: student.strengths.join('; '),
      'Areas for Improvement': student.weaknesses.join('; ')
    }));

    const csv = [
      Object.keys(studentRows[0]).join(','),
      ...studentRows.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `class-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const generatePDFReport = async () => {
    // In a real app, you might want to use a PDF library like pdfmake
    // This is just a placeholder
    console.log('Generating PDF report...');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      switch (exportFormat) {
        case 'excel':
          generateExcelReport();
          break;
        case 'csv':
          generateCSVReport();
          break;
        case 'pdf':
          await generatePDFReport();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <span>Export Report</span>
        <span>↓</span>
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <div className="p-2">
            {['pdf', 'excel', 'csv'].map(format => (
              <button
                key={format}
                onClick={() => {
                  setExportFormat(format as typeof exportFormat);
                  handleExport();
                }}
                disabled={isExporting}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md capitalize"
              >
                Export as {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-center">Generating report...</p>
          </div>
        </div>
      )}
    </div>
  );
}; 