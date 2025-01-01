export const mockPDFParser = {
  on: jest.fn(),
  loadPDF: jest.fn(),
  getRawTextContent: jest.fn().mockReturnValue('Mock PDF content'),
};

jest.mock('pdf2json', () => {
  return jest.fn().mockImplementation(() => mockPDFParser);
}); 