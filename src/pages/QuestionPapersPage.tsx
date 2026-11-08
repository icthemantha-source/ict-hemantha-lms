import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Lock, 
  CheckCircle,
  FolderDown
} from 'lucide-react';

interface QuestionPapersPageProps {
  navigate: (path: string) => void;
}

export const QuestionPapersPage: React.FC<QuestionPapersPageProps> = ({ navigate }) => {
  const { questionPapers, incrementPaperDownload, enrollments } = useData();
  const { currentUser } = useAuth();
  const { language } = useLanguage();

  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [accessWarning, setAccessWarning] = useState('');

  const filteredPapers = questionPapers.filter((p) => {
    const matchesGrade = selectedGrade === 'all' || p.grade === selectedGrade;
    const matchesType = selectedType === 'all' || p.paperType === selectedType;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.academicYear.includes(searchQuery);
    return matchesGrade && matchesType && matchesSearch;
  });

  const handleDownload = (paper: any) => {
    const isRestricted = paper.isRestrictedToEnrolled;
    const isEnrolled = currentUser ? (
      currentUser.role === 'admin' ||
      currentUser.role === 'teacher' ||
      enrollments.some(e => e.studentId === currentUser.id && e.grade === paper.grade && e.status === 'active')
    ) : false;

    if (isRestricted && !isEnrolled) {
      setAccessWarning(`This paper is reserved for enrolled Grade ${paper.grade} students. Please enroll or log into your academy student account.`);
      return;
    }
    setAccessWarning('');

    incrementPaperDownload(paper.id);
    // Trigger download
    const link = document.createElement('a');
    link.href = paper.fileUrl;
    link.download = `${paper.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#0B1F4A] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F58220] text-xs font-bold uppercase tracking-wider text-white">
            <FolderDown className="w-3.5 h-3.5" />
            <span>Digital Past Paper Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ICT Question Papers & Model Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sinhala leading-relaxed">
            පසුගිය විභාග ප්‍රශ්න පත්‍ර (2016-2025), පළාත් වාර විභාග පත්‍ර සහ හේමන්ත සර් විසින් සැකසූ විශේෂ O/L ඉලක්කගත ආදර්ශ ප්‍රශ්න පත්‍ර බාගත කරගන්න.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[200px]">
          <div className="text-2xl font-extrabold text-[#F58220]">
            {questionPapers.length}
          </div>
          <div className="text-xs text-slate-300">Published Papers Available</div>
        </div>
      </div>

      {accessWarning && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
          <span>🔒 {accessWarning}</span>
          <button
            onClick={() => setAccessWarning('')}
            className="text-amber-700 hover:text-amber-900 font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, year, or exam title..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#2563A6]"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Grade:</span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedGrade === 'all'
                ? 'bg-[#0B1F4A] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Grades
          </button>
          {[6, 7, 8, 9, 10, 11].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedGrade === g
                  ? 'bg-[#2563A6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Grade {g}
            </button>
          ))}
        </div>

        {/* Paper Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="all">All Paper Types</option>
            <option value="Past Paper">National Past Papers</option>
            <option value="Model Paper">Hemantha Sir Model Papers</option>
            <option value="Term Test">Provincial Term Tests</option>
            <option value="Revision Paper">Revision Question Sets</option>
          </select>
        </div>

      </div>

      {/* Question Papers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => {
          const isRestricted = paper.isRestrictedToEnrolled;
          const isEnrolled = currentUser ? (
            currentUser.role === 'admin' ||
            currentUser.role === 'teacher' ||
            enrollments.some(e => e.studentId === currentUser.id && e.grade === paper.grade && e.status === 'active')
          ) : false;

          return (
            <div
              key={paper.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#EAF3FC] text-[#2563A6]">
                    Grade {paper.grade} ICT
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {paper.academicYear}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#F58220] uppercase">
                    {paper.paperType}
                  </div>
                  <h3 className="font-bold text-sm text-[#0B1F4A] leading-snug">
                    {paper.title}
                  </h3>
                  {paper.titleSi && (
                    <p className="text-xs font-sinhala text-slate-600">
                      {paper.titleSi}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {paper.fileSizeMb} MB · {paper.downloadCount} Downloads
                </span>

                <button
                  onClick={() => handleDownload(paper)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isRestricted && !isEnrolled
                      ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      : 'bg-[#F58220] hover:bg-[#e07519] text-white shadow-xs'
                  }`}
                >
                  {isRestricted && !isEnrolled ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Enrolled Only</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
