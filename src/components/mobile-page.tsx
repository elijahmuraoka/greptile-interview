import { MdOutlineDesktopAccessDisabled } from 'react-icons/md';

export default function MobilePage() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center text-center md:hidden">
      <div className="flex w-[90%] flex-col items-center justify-center gap-6 rounded-lg border-2 border-primary bg-white p-8 shadow-md">
        <MdOutlineDesktopAccessDisabled className="text-6xl text-red-600" />
        <h1 className="text-2xl">Sorry, this web application is not available on mobile.</h1>
        <p className="text-base text-foreground/70">
          Please visit on a desktop device to view this page.
        </p>
      </div>
    </section>
  );
}
