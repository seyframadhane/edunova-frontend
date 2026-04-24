import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import { Search, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Step 3: Profile form state — pre-filled from user context
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // 👈 NEW
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');

  const goals = [
    "Enter in new industry",
    "Hobby",
    "Advance in your field",
    "Self Improvement"
  ];

  const fields = [
    "Design",
    "Cyber Security",
    "Cloud Computing",
    "Front-end Development",
    "Back-end Development",
    "Data Science"
  ];

  const filteredFields = fields.filter(field =>
    field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleFieldToggle = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else if (selectedFields.length < 3) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && selectedGoal) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedFields.length > 0) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setSaving(true);
      try {
        // 1) Upload the avatar first (if one was picked).
        //    This persists it to /uploads/avatars and sets user.avatar on the server.
        if (profileImageFile) {
          try {
            await authService.uploadAvatar(profileImageFile);
          } catch (err) {
            console.error('Avatar upload failed:', err);
            // Non-fatal — continue onboarding even if avatar upload fails.
          }
        }

        // 2) Save the rest of the onboarding data.
        //    The server's updateOnboarding does not touch avatar, so step (1) is preserved.
        const { data } = await authService.completeOnboarding({
          careerGoal: selectedGoal as string,
          interests: selectedFields,
          city,
          country,
        });
        setUser(data.data); // contains the new avatar URL
        navigate('/home');
      } catch (err) {
        console.error('Onboarding failed:', err);
        navigate('/home');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file); // 👈 NEW — keep the raw file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkip = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
    setSaving(true);
    try {
      if (profileImageFile) {
        try { await authService.uploadAvatar(profileImageFile); } catch { }
      }
      const { data } = await authService.completeOnboarding({
        careerGoal: selectedGoal || 'Self Improvement',
        interests: selectedFields,
        city,
        country,
      });
      setUser(data.data);
    } catch {
      // ignore
    } finally {
      setSaving(false);
      navigate('/home');
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="pt-8 flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-12 h-1.5 rounded-full ${step <= currentStep ? 'bg-gray-800' : 'bg-gray-200'
                }`}
            ></div>
          ))}
        </div>
        <p className="text-gray-500 font-medium">{currentStep} of 3</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen h-screen bg-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header / Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
        <span className="text-xl font-bold text-gray-800">EduNova AI</span>
      </div>

      <button
        onClick={handleSkip}
        disabled={saving}
        className="absolute top-8 right-8 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors disabled:opacity-50"
      >
        Skip
      </button>

      <div className={`w-full text-center ${currentStep === 3 ? 'max-w-2xl space-y-4' : 'max-w-md space-y-8 mt-12'}`}>
        {/* Step 1: Career Goal */}
        {currentStep === 1 && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              What's your current career goal?
            </h1>
            <p className="text-gray-500">Select any one from the below</p>

            <div className="space-y-4">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalSelect(goal)}
                  className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all duration-200 ${selectedGoal === goal
                    ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedGoal === goal ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-gray-100'
                    }`}>
                    {selectedGoal === goal && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <span className={`text-lg font-medium ${selectedGoal === goal ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {goal}
                  </span>
                </button>
              ))}
            </div>

            {selectedGoal && (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
              >
                Next
              </button>
            )}
          </>
        )}

        {/* Step 2: Field of Study */}
        {currentStep === 2 && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              What field are you interested in studying?
            </h1>
            <p className="text-gray-500">Select any three from the below</p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Field Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {filteredFields.map((field) => (
                <button
                  key={field}
                  onClick={() => handleFieldToggle(field)}
                  disabled={!selectedFields.includes(field) && selectedFields.length >= 3}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedFields.includes(field)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                >
                  {field}
                </button>
              ))}
            </div>

            {selectedFields.length > 0 && (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
              >
                Next
              </button>
            )}
          </>
        )}

        {/* Step 3: Location & Profile Photo */}
        {currentStep === 3 && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              Help us to know you better
            </h1>
            <p className="text-gray-500 text-sm">Add your location and a profile photo (optional)</p>

            {/* Greeting with pre-filled name */}
            {user && (
              <p className="text-indigo-600 font-semibold text-lg">
                Welcome, {user.firstName}! 👋
              </p>
            )}

            {/* Image Upload */}
            <div className="space-y-1 flex flex-col items-center">
              <label className="block text-left text-gray-700 font-semibold w-full">Profile Photo (Optional)</label>
              <div className="relative flex justify-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-25 h-25 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-indigo-600 transition-colors"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <span className="text-gray-500">Click here to Upload</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Location Fields */}
            <div className="space-y-4 text-left">
              {/* City */}
              <div>
                <label className="block text-gray-700 font-medium">
                  City <span className="text-gray-400 text-sm font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Country <span className="text-gray-400 text-sm font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-10 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Finish button — always enabled on step 3 since fields are optional */}
            <button
              onClick={handleNext}
              disabled={saving}
              className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Finish Setup'}
            </button>
          </>
        )}

        {/* Progress Indicator */}
        {renderProgressBar()}
      </div>
    </div>
  );
};

export default OnboardingPage;