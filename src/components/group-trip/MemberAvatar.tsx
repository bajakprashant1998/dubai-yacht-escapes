const MemberAvatar = ({ name, isOrganizer }: { name: string; isOrganizer: boolean }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
      isOrganizer
        ? "bg-secondary text-secondary-foreground ring-2 ring-secondary/30"
        : "bg-muted text-muted-foreground"
    }`}>
      {initials}
    </div>
  );
};

export default MemberAvatar;
