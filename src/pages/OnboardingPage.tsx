import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import {
  Search, Upload, Check, ChevronLeft, ChevronRight, Loader2, X,
  Rocket, Heart, TrendingUp, Sparkles,
  Palette, ShieldCheck, Cloud, Code2, Server, LineChart,
  MapPin, Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

/* ---------- data ---------- */

type StepKey = 1 | 2 | 3;

const STEPS: { key: StepKey; label: string; caption: string }[] = [
  { key: 1, label: 'Your goal',   caption: 'Tell us why you’re here' },
  { key: 2, label: 'Interests',   caption: 'Pick up to 3 topics' },
  { key: 3, label: 'Your profile',caption: 'A few final touches' },
];

/* IMPORTANT: these strings must stay exactly as-is — the backend matches
   them against User.careerGoal enum and Course.topics/category regex. */
const GOALS: { name: string; desc: string; Icon: React.ComponentType<any> }[] = [
  { name: 'Enter in new industry', desc: 'Switch careers with confidence',  Icon: Rocket },
  { name: 'Advance in your field', desc: 'Level up your expertise',         Icon: TrendingUp },
  { name: 'Self Improvement',      desc: 'Grow your skills and mindset',    Icon: Sparkles },
  { name: 'Hobby',                 desc: 'Learn for fun and exploration',   Icon: Heart },
];

const FIELDS: { name: string; desc: string; Icon: React.ComponentType<any> }[] = [
  { name: 'Design',                 desc: 'UI, UX & visual design',     Icon: Palette },
  { name: 'Cyber Security',         desc: 'Ethical hacking & defense',  Icon: ShieldCheck },
  { name: 'Cloud Computing',        desc: 'AWS, Azure & DevOps',        Icon: Cloud },
  { name: 'Front-end Development',  desc: 'React, CSS & web UI',        Icon: Code2 },
  { name: 'Back-end Development',   desc: 'APIs, databases & servers',  Icon: Server },
  { name: 'Data Science',           desc: 'ML, analytics & Python',     Icon: LineChart },
];

const MAX_INTERESTS = 3;

/* ---------- component ---------- */

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepKey>(1);

  const [selectedGoal, setSelectedGoal]     = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [searchQuery, setSearchQuery]       = useState('');

  const [profileImage, setProfileImage]         = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [city, setCity]       = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');

  const filteredFields = FIELDS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ---------- handlers ---------- */

  const handleFieldToggle = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else if (selectedFields.length < MAX_INTERESTS) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setProfileImage(null);
    setProfileImageFile(null);
  };

  const finish = async (goalOverride?: string) => {
    setSaving(true);
    try {
      if (profileImageFile) {
        try { await authService.uploadAvatar(profileImageFile); }
        catch (err) { console.error('Avatar upload failed:', err); }
      }
      const { data } = await authService.completeOnboarding({
        careerGoal: (goalOverride ?? selectedGoal) as string,
        interests: selectedFields,
        city,
        country,
      });
      setUser(data.data);
      navigate('/home');
    } catch (err) {
      console.error('Onboarding failed:', err);
      navigate('/home');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && selectedGoal) setCurrentStep(2);
    else if (currentStep === 2 && selectedFields.length > 0) setCurrentStep(3);
    else if (currentStep === 3) await finish();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as StepKey);
  };

  const handleSkip = async () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as StepKey);
      return;
    }
    await finish(selectedGoal || 'Self Improvement');
  };

  /* ---------- derived ---------- */

  const canAdvance =
    (currentStep === 1 && !!selectedGoal) ||
    (currentStep === 2 && selectedFields.length > 0) ||
    currentStep === 3;

  const stepMeta = STEPS.find(s => s.key === currentStep)!;

  /* ---------- render ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex">
      {/* Left brand panel — hidden on small screens */}
      <aside className="hidden lg:flex w-[38%] xl:w-[34%] relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#2a1a5e] to-[#6C3EF4] text-white p-12 flex-col">
        {/* decorative blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="EduNova" className="w-10 h-10 object-contain" />
          <span className="text-xl font-semibold tracking-tight">EduNova AI</span>
        </div>

        <div className="relative z-10 mt-auto">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Personalized learning,<br />tailored to your goals.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
            Three quick steps and we’ll curate courses, mentors and projects
            that fit exactly where you are — and where you want to go.
          </p>

          <ul className="space-y-4 max-w-md">
            {[
              'Recommendations based on your career goal',
              'Courses matched to your chosen interests',
              'A profile that grows as you learn',
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-10 text-sm text-white/50">
          © {new Date().getFullYear()} EduNova — Learn smarter.
        </div>
      </aside>

      {/* Right content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 lg:px-12 py-6 border-b border-gray-100/80">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logo} alt="EduNova" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-gray-900">EduNova AI</span>
          </div>
          <div className="hidden lg:block text-sm text-gray-500">
            Step {currentStep} of {STEPS.length} · {stepMeta.caption}
          </div>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition disabled:opacity-50"
          >
            Skip for now
          </button>
        </header>

        {/* Stepper */}
        <div className="px-6 lg:px-12 pt-8">
          <ol className="flex items-center gap-2 sm:gap-4 max-w-2xl">
            {STEPS.map((s, idx) => {
              const done = currentStep > s.key;
              const active = currentStep === s.key;
              return (
                <li key={s.key} className="flex-1 flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full grid place-items-center text-sm font-semibold ring-2 transition
                      ${done ? 'bg-[#6C3EF4] text-white ring-[#6C3EF4]'
                        : active ? 'bg-white text-[#6C3EF4] ring-[#6C3EF4]'
                        : 'bg-white text-gray-400 ring-gray-200'}`}
                  >
                    {done ? <Check className="w-4 h-4" /> : s.key}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <div className={`text-sm font-medium truncate ${active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {s.label}
                    </div>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-[2px] rounded-full ${done ? 'bg-[#6C3EF4]' : 'bg-gray-200'}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Content area */}
        <section className="flex-1 px-6 lg:px-12 py-10">
          <div className="max-w-2xl mx-auto">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  What’s your current career goal?
                </h1>
                <p className="mt-2 text-gray-500">Choose the one that fits you best — you can change this later.</p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GOALS.map(({ name, desc, Icon }) => {
                    const active = selectedGoal === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedGoal(name)}
                        className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-200
                          ${active
                            ? 'border-[#6C3EF4] bg-gradient-to-br from-indigo-50 to-white shadow-md shadow-indigo-100'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-xl grid place-items-center flex-shrink-0 transition
                            ${active ? 'bg-[#6C3EF4] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900">{name}</div>
                            <div className="text-sm text-gray-500 mt-0.5">{desc}</div>
                          </div>
                          <div className={`ml-auto w-5 h-5 rounded-full border-2 grid place-items-center transition flex-shrink-0
                            ${active ? 'border-[#6C3EF4] bg-[#6C3EF4]' : 'border-gray-300'}`}>
                            {active && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  What would you like to learn?
                </h1>
                <p className="mt-2 text-gray-500">
                  Pick up to {MAX_INTERESTS} topics —{' '}
                  <span className="font-medium text-gray-700">
                    {selectedFields.length}/{MAX_INTERESTS} selected
                  </span>
                </p>

                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search topics"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30 focus:border-[#6C3EF4] transition"
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredFields.map(({ name, desc, Icon }) => {
                    const active = selectedFields.includes(name);
                    const disabled = !active && selectedFields.length >= MAX_INTERESTS;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleFieldToggle(name)}
                        disabled={disabled}
                        className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                          ${active
                            ? 'border-[#6C3EF4] bg-indigo-50/60 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'}
                          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200`}
                      >
                        <div className={`w-10 h-10 rounded-lg grid place-items-center flex-shrink-0 transition
                          ${active ? 'bg-[#6C3EF4] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-sm">{name}</div>
                          <div className="text-xs text-gray-500 truncate">{desc}</div>
                        </div>
                        {active && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6C3EF4] grid place-items-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {filteredFields.length === 0 && (
                    <div className="sm:col-span-2 text-center text-sm text-gray-500 py-8">
                      No topics match “{searchQuery}”.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  {user ? `Nice to meet you, ${user.firstName}` : 'Tell us a bit about you'}
                </h1>
                <p className="mt-2 text-gray-500">
                  Add a photo and your location. Both are optional — you can set them later in your profile.
                </p>

                {/* Avatar */}
                <div className="mt-8 flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gray-100 ring-4 ring-white shadow-md overflow-hidden grid place-items-center">
                      {profileImage ? (
                        <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : user?.avatar ? (
                        <img src={user.avatar} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-semibold text-gray-400">
                          {(user?.firstName?.[0] || '').toUpperCase()}
                          {(user?.lastName?.[0] || '').toUpperCase()}
                        </span>
                      )}
                    </div>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow grid place-items-center text-gray-500 hover:text-red-500 transition"
                        aria-label="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      {profileImage ? <Camera className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      {profileImage ? 'Change photo' : 'Upload photo'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <p className="mt-2 text-xs text-gray-500">PNG, JPG or GIF · up to 5 MB</p>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LabeledInput
                    label="City"
                    icon={<MapPin className="w-4 h-4" />}
                    placeholder="e.g. Algiers"
                    value={city}
                    onChange={setCity}
                  />
                  <LabeledInput
                    label="Country"
                    icon={<MapPin className="w-4 h-4" />}
                    placeholder="e.g. Algeria"
                    value={country}
                    onChange={setCountry}
                  />
                </div>

                {/* Summary chips */}
                <div className="mt-10 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your selections</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedGoal && (
                      <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                        🎯 {selectedGoal}
                      </span>
                    )}
                    {selectedFields.map(f => (
                      <span key={f} className="px-3 py-1.5 bg-[#6C3EF4]/10 text-[#6C3EF4] rounded-full text-xs font-medium">
                        {f}
                      </span>
                    ))}
                    {!selectedGoal && selectedFields.length === 0 && (
                      <span className="text-xs text-gray-400">No selections yet</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer actions */}
        <footer className="border-t border-gray-100 bg-white/80 backdrop-blur px-6 lg:px-12 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || saving}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance || saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold shadow-lg shadow-indigo-900/10 hover:bg-[#6C3EF4] hover:shadow-indigo-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a2e]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : currentStep === 3 ? (
                <>
                  Finish setup
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </footer>
      </main>

      {/* tiny keyframes for the step transition */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ---------- sub-components ---------- */

function LabeledInput({
  label, icon, placeholder, value, onChange,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label} <span className="text-gray-400 font-normal">(optional)</span></span>
      <div className="mt-1.5 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30 focus:border-[#6C3EF4] transition"
        />
      </div>
    </label>
  );
}

export default OnboardingPage;