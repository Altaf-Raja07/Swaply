export default function TeacherProfileLoading() {
  return (
    <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen animate-pulse">
      <div className="flex flex-col md:flex-row gap-stack-lg mb-stack-lg">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl bg-surface-container-high" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-64 bg-surface-container-high rounded" />
          <div className="h-4 w-32 bg-surface-container-high rounded" />
          <div className="h-4 w-48 bg-surface-container-high rounded" />
        </div>
      </div>
    </main>
  );
}
