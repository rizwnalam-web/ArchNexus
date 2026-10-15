import React, { useState, useMemo } from 'react';
import {
  FDE_LIFECYCLE_STAGES,
  FDE_ECOSYSTEM_TOOLS,
  TOOL_CATEGORIES,
  FdeLifecycleStage,
  FdeEcosystemTool
} from '../data/aiToolingEcosystemData';
import {
  Workflow,
  Search,
  Filter,
  Terminal,
  Check,
  Copy,
  Download,
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Server,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  TestTube2,
  Eye,
  GitBranch
} from 'lucide-react';

interface AiToolingEcosystemVisualMapProps {
  onNavigateToMethodologyPhase?: (phaseNumber: number) => void;
  initialStageId?: string;
}

export const AiToolingEcosystemVisualMap: React.FC<AiToolingEcosystemVisualMapProps> = ({
  onNavigateToMethodologyPhase,
  initialStageId
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(initialStageId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tools');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'pipeline' | 'matrix' | 'deepdive'>('pipeline');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedToolModal, setSelectedToolModal] = useState<FdeEcosystemTool | null>(null);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    return FDE_ECOSYSTEM_TOOLS.filter((tool) => {
      const matchesStage = selectedStageId === 'all' || tool.lifecycleStageId === selectedStageId;
      const matchesCategory = selectedCategory === 'All Tools' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.technicalDefinition.toLowerCase().includes(q) ||
        tool.fdeResponsibility.toLowerCase().includes(q) ||
        tool.lifecycleStageName.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.sampleUseCases.some(uc => uc.toLowerCase().includes(q));

      return matchesStage && matchesCategory && matchesSearch;
    });
  }, [selectedStageId, selectedCategory, searchQuery]);

  // Export Ecosystem Markdown
  const handleExportMarkdown = () => {
    const md = `# FDE AI Tooling Ecosystem & Implementation Lifecycle Visual Blueprint

> Authoritative architectural mapping of frontier AI tools, code analysis engines, infrastructure provisioning synthesizers, and synthetic verification agents across the Forward Deployed Engineering (FDE) lifecycle.

---

## 🗺️ FDE Implementation Lifecycle Overview

| Stage # | Lifecycle Stage | Primary Objective | Velocity Multiplier | Target Deliverables |
| :---: | :--- | :--- | :--- | :--- |
${FDE_LIFECYCLE_STAGES.map(
  s => `| **${s.stageNumber}** | ${s.title} | ${s.objective} | \`${s.velocityMultiplier}\` | ${s.outputArtifacts.join(', ')} |`
).join('\n')}

---

## 🛠️ Complete Tooling Ecosystem Directory & Operational Responsibilities

${FDE_ECOSYSTEM_TOOLS.map((tool, idx) => `
### ${idx + 1}. ${tool.name} (\`${tool.category}\`)
- **Lifecycle Stage:** Stage ${FDE_LIFECYCLE_STAGES.find(s => s.id === tool.lifecycleStageId)?.stageNumber || '-'}: ${tool.lifecycleStageName}
- **Methodology Phase:** Phase ${tool.methodologyPhaseNumber}
- **Technical Definition:** ${tool.technicalDefinition}
- **FDE Production Responsibility:** ${tool.fdeResponsibility}
- **Key Capabilities:**
${tool.keyCapabilities.map(c => `  - ${c}`).join('\n')}
- **Velocity / ROI Impact:** \`${tool.roiOrVelocityImpact}\`
- **Governance & Policy Guardrail:** ${tool.governanceGuardrail}
- **Execution CLI / Setup:**
\`\`\`bash
${tool.executionCommand}
\`\`\`
- **Sample Enterprise Use Cases:**
${tool.sampleUseCases.map(u => `  - ${u}`).join('\n')}

---
`).join('\n')}

*Exported from ArchFiddle Enterprise Methodology & AI Tooling Ecosystem Map*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fde-ai-tooling-ecosystem-map.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: AI Tooling Ecosystem Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/40 border border-indigo-900/40 p-5 sm:p-6 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> FDE LIFECYCLE TAXONOMY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-mono font-bold">
                8 Lifecycle Stages
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-bold">
                {FDE_ECOSYSTEM_TOOLS.length} Production AI Tools
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>AI Tooling Ecosystem & Lifecycle Visual Map</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Interactive architectural map charting how specialized AI engines—from legacy code reverse-engineering and automated IaC synthesizers to synthetic testing frameworks and autonomous multi-agent graphs—map directly onto each phase of the Forward Deployed Engineering lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* View Mode Buttons */}
            <div className="flex items-center p-1 bg-zinc-950/90 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setActiveViewMode('pipeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeViewMode === 'pipeline'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Visual Pipeline Flow"
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Pipeline Flow</span>
              </button>
              <button
                onClick={() => setActiveViewMode('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeViewMode === 'matrix'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Categorized Matrix"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tool Matrix</span>
              </button>
              <button
                onClick={() => setActiveViewMode('deepdive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeViewMode === 'deepdive'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Stage Deep-Dive"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Stage Audit</span>
              </button>
            </div>

            <button
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all shadow"
              title="Download Ecosystem Spec as Markdown"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI tools by name, responsibility, CLI, or capability..."
              className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="text-xs text-zinc-400 font-mono shrink-0 flex items-center gap-2">
            <span>Showing:</span>
            <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
              {filteredTools.length} of {FDE_ECOSYSTEM_TOOLS.length} Tools
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <span className="text-zinc-500 font-bold uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stage Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs pt-1 border-t border-zinc-900">
          <span className="text-zinc-500 font-bold uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Lifecycle Stage:
          </span>
          <button
            onClick={() => setSelectedStageId('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              selectedStageId === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            All 8 Stages
          </button>
          {FDE_LIFECYCLE_STAGES.map((stage) => {
            const isSelected = selectedStageId === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? `${stage.colorTheme.pillBg} ${stage.colorTheme.pillText} border-current ring-1 ring-current/40`
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span>{stage.icon}</span>
                <span>Stage {stage.stageNumber}: {stage.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE PIPELINE FLOW */}
      {activeViewMode === 'pipeline' && (
        <div className="space-y-6">
          {/* Horizontal Stepping Roadmap Diagram */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-blue-400" />
                <span>End-to-End FDE Implementation Pipeline: Stages 1 → 8</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                Click any stage card to inspect inputs, outputs & mapped AI tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {FDE_LIFECYCLE_STAGES.map((stage, idx) => {
                const stageTools = FDE_ECOSYSTEM_TOOLS.filter(t => t.lifecycleStageId === stage.id);
                const isSelected = selectedStageId === stage.id;

                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStageId(isSelected ? 'all' : stage.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isSelected
                        ? `${stage.colorTheme.bg} ${stage.colorTheme.border} ring-2 ring-blue-500/50 shadow-lg`
                        : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    {/* Top line with stage and icon */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${stage.colorTheme.pillBg} ${stage.colorTheme.pillText} border border-current/20`}>
                          Stage {stage.stageNumber}
                        </span>
                        <span className="text-xl p-1 bg-zinc-950/80 rounded-lg border border-zinc-800/60 group-hover:scale-110 transition-transform">
                          {stage.icon}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {stage.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {stage.objective}
                      </p>
                    </div>

                    {/* Bottom tools badge */}
                    <div className="pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-purple-400" />
                        <span className="text-zinc-300 font-bold">{stageTools.length}</span> AI Tools Mapped
                      </span>
                      <span className={`text-[10px] font-bold ${stage.colorTheme.text}`}>
                        {stage.velocityMultiplier.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Tool Grid by Stage */}
          <div className="space-y-6">
            {FDE_LIFECYCLE_STAGES.filter(s => selectedStageId === 'all' || s.id === selectedStageId).map((stage) => {
              const toolsInStage = filteredTools.filter(t => t.lifecycleStageId === stage.id);
              if (toolsInStage.length === 0) return null;

              return (
                <div
                  key={stage.id}
                  className={`bg-zinc-950 border ${stage.colorTheme.border} rounded-2xl p-5 space-y-4 shadow-xl transition-all relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                        {stage.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${stage.colorTheme.pillBg} ${stage.colorTheme.pillText} uppercase`}>
                            Stage {stage.stageNumber} of 8
                          </span>
                          <span className="text-xs text-zinc-400">
                            Maps to <span className="text-indigo-300 font-bold">Methodology Phase {stage.methodologyPhaseNumber}</span>
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white tracking-tight">
                          {stage.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
                        ⚡ {stage.velocityMultiplier}
                      </span>
                      {onNavigateToMethodologyPhase && (
                        <button
                          onClick={() => onNavigateToMethodologyPhase(stage.methodologyPhaseNumber)}
                          className="text-[11px] font-bold px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg border border-zinc-700 flex items-center gap-1 transition-all"
                        >
                          <span>Phase {stage.methodologyPhaseNumber} Blueprint</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FDE Core Duty Banner */}
                  <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>FDE Primary Engineering Duty:</span>
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-medium">
                      {stage.fdeDuty}
                    </p>
                  </div>

                  {/* Tool Cards in this stage */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {toolsInStage.map((tool) => (
                      <div
                        key={tool.id}
                        className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all group"
                      >
                        <div className="space-y-3">
                          {/* Card Top */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                                  {tool.name}
                                </h5>
                              </div>
                              <span className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                                {tool.category}
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedToolModal(tool)}
                              className="text-[11px] px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded font-medium transition-all"
                            >
                              Details
                            </button>
                          </div>

                          {/* Technical Definition */}
                          <div className="p-2.5 bg-black/40 border border-zinc-800/60 rounded-lg text-xs text-zinc-300 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-purple-300 flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-purple-400" /> Technical Definition:
                            </span>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">
                              {tool.technicalDefinition}
                            </p>
                          </div>

                          {/* FDE Operational Responsibility */}
                          <div className="p-2.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Operational Responsibility:
                            </span>
                            <p className="text-emerald-100/90 text-[11px] leading-relaxed font-medium">
                              {tool.fdeResponsibility}
                            </p>
                          </div>

                          {/* CLI Snippet */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
                              <span className="flex items-center gap-1">
                                <Terminal className="w-3 h-3 text-amber-400" /> Execution Command:
                              </span>
                              <button
                                onClick={() => handleCopyCode(tool.executionCommand, tool.id)}
                                className="text-zinc-500 hover:text-zinc-200 flex items-center gap-1 font-mono normal-case"
                              >
                                {copiedCodeId === tool.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy CLI</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-2 bg-black/80 border border-zinc-800 rounded font-mono text-[11px] text-amber-300 overflow-x-auto custom-scrollbar">
                              <code>{tool.executionCommand}</code>
                            </pre>
                          </div>
                        </div>

                        {/* Card Footer: Impact & Guardrail */}
                        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                          <span className="text-indigo-300 font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-indigo-400" /> {tool.roiOrVelocityImpact}
                          </span>
                          <span className="text-zinc-400 truncate max-w-xs text-[10px]">
                            🔒 {tool.governanceGuardrail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CATEGORIZED MATRIX */}
      {activeViewMode === 'matrix' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Cross-Lifecycle AI Tooling Responsibility Matrix</span>
            </h4>
            <span className="text-xs text-zinc-400 font-mono">
              {filteredTools.length} Tools Evaluated
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 uppercase font-mono font-bold text-[10px]">
                  <th className="p-3">Tool & Engine</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Lifecycle Stage</th>
                  <th className="p-3">FDE Operational Responsibility</th>
                  <th className="p-3">Velocity Impact</th>
                  <th className="p-3">Governance Guardrail</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{tool.name}</span>
                        <span className="font-mono text-[10px] text-zinc-500">Phase {tool.methodologyPhaseNumber}</span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                        {tool.category}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-300 font-medium whitespace-nowrap">
                      {tool.lifecycleStageName.split('&')[0]}
                    </td>
                    <td className="p-3 text-zinc-300 min-w-[280px] leading-relaxed">
                      {tool.fdeResponsibility}
                    </td>
                    <td className="p-3 text-emerald-400 font-mono font-semibold whitespace-nowrap">
                      {tool.roiOrVelocityImpact}
                    </td>
                    <td className="p-3 text-zinc-400 text-[11px] min-w-[200px]">
                      {tool.governanceGuardrail}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedToolModal(tool)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-blue-300 hover:text-white rounded text-[11px] font-semibold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: STAGE AUDIT & DEEP DIVE */}
      {activeViewMode === 'deepdive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {FDE_LIFECYCLE_STAGES.map((stage) => {
              const stageTools = FDE_ECOSYSTEM_TOOLS.filter(t => t.lifecycleStageId === stage.id);

              return (
                <div
                  key={stage.id}
                  className={`bg-zinc-950 border ${stage.colorTheme.border} rounded-2xl p-5 space-y-4 shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                        {stage.icon}
                      </span>
                      <div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${stage.colorTheme.pillBg} ${stage.colorTheme.pillText}`}>
                          Stage {stage.stageNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white">{stage.title}</h4>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {stage.velocityMultiplier}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {stage.objective}
                  </p>

                  {/* Artifacts: In vs Out */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1.5">
                      <span className="font-bold text-rose-300 text-[10px] uppercase flex items-center gap-1">
                        <FileCode2 className="w-3.5 h-3.5 text-rose-400" /> Input Artifacts:
                      </span>
                      <ul className="space-y-1 text-zinc-400 text-[11px]">
                        {stage.inputArtifacts.map((art, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{art}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1.5">
                      <span className="font-bold text-emerald-300 text-[10px] uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Output Artifacts:
                      </span>
                      <ul className="space-y-1 text-zinc-400 text-[11px]">
                        {stage.outputArtifacts.map((art, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{art}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mapped Tools in this Stage */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" /> AI Tools Deployed in Stage {stage.stageNumber}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {stageTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => setSelectedToolModal(tool)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-medium flex items-center gap-1.5 transition-all hover:scale-105 ${tool.badgeColor}`}
                        >
                          <span>{tool.name}</span>
                          <span className="text-[10px] opacity-70">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER FOR INSPECTED TOOL */}
      {selectedToolModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${selectedToolModal.badgeColor}`}>
                  {selectedToolModal.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedToolModal.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Stage: {selectedToolModal.lifecycleStageName} • Methodology Phase {selectedToolModal.methodologyPhaseNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedToolModal(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Technical Definition */}
            <div className="p-3.5 bg-black/40 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-purple-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Technical Definition & Underlying Engine:</span>
              </span>
              <p className="text-zinc-200 leading-relaxed">
                {selectedToolModal.technicalDefinition}
              </p>
            </div>

            {/* FDE Operational Responsibility */}
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Forward Deployed Engineer (FDE) Responsibility:</span>
              </span>
              <p className="text-emerald-100 font-medium leading-relaxed">
                {selectedToolModal.fdeResponsibility}
              </p>
            </div>

            {/* Key Capabilities */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Core Enterprise Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedToolModal.keyCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg text-zinc-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span className="text-[11px] leading-relaxed">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Command */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" /> Setup & Execution CLI:
                </span>
                <button
                  onClick={() => handleCopyCode(selectedToolModal.executionCommand, 'modal-cli')}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  {copiedCodeId === 'modal-cli' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-black/90 border border-zinc-800 rounded-xl font-mono text-xs text-amber-300 overflow-x-auto">
                <code>{selectedToolModal.executionCommand}</code>
              </pre>
            </div>

            {/* Sample Enterprise Use Cases */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-300">
                Production Case Study Deployments:
              </span>
              <ul className="space-y-1 text-xs text-zinc-400">
                {selectedToolModal.sampleUseCases.map((uc, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-[11px] text-zinc-300">{uc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Velocity & Guardrail footer */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-indigo-300 font-bold">
                Impact: {selectedToolModal.roiOrVelocityImpact}
              </div>
              <div className="text-zinc-400 text-[11px]">
                Guardrail: {selectedToolModal.governanceGuardrail}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedToolModal(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
