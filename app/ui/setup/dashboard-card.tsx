interface CardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string,
}

export default function Card({ children, title, subtitle }: CardProps) {
  return (
    <div className="mx-auto bg-blackbg-100 shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-500 bg-[#212529]">
        <h2 className="text-xl font-semibold text-orange-400">{title}</h2>
        <p className="text-sm text-gray-100 mt-1">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}
