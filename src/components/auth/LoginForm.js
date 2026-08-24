function LoginForm({ children }) {
  return (
    <div className="flex justify-center items-center p-8">

      <div
        className="
          w-full
          max-w-md
          bg-white/80
          backdrop-blur-2xl
          rounded-3xl
          shadow-2xl
          border
          border-white/40
          p-10
        "
      >

        {children}

      </div>

    </div>
  );
}

export default LoginForm;