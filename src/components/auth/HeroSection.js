import { FaShieldAlt, FaChartLine, FaMobileAlt, FaLock } from "react-icons/fa";

function HeroSection() {
  return (
    <div className="hidden lg:flex flex-col justify-center relative overflow-hidden text-white p-16 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-600">

      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>

      <div className="relative z-10">

        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md mb-8">

          <FaShieldAlt />

          <span>Trusted by 10,000+ Users</span>

        </div>

        <h1 className="text-6xl font-bold leading-tight">

          Secure Banking
          <br />

          <span className="text-cyan-300">

            For Everyone

          </span>

        </h1>

        <p className="mt-8 text-xl text-slate-200 max-w-xl">

          Manage your finances, transfer funds, pay bills,
          and grow your wealth with confidence.

        </p>

        <div className="grid grid-cols-2 gap-8 mt-14">

          <Feature
            icon={<FaLock />}
            title="Bank-Level Security"
          />

          <Feature
            icon={<FaChartLine />}
            title="Real-Time Analytics"
          />

          <Feature
            icon={<FaMobileAlt />}
            title="Mobile Banking"
          />

          <Feature
            icon={<FaShieldAlt />}
            title="Protected Transactions"
          />

        </div>

      </div>

    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="flex items-center gap-4">

      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 text-xl backdrop-blur-md">

        {icon}

      </div>

      <span className="font-medium">

        {title}

      </span>

    </div>
  );
}

export default HeroSection;