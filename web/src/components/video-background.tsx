export const VideoBackground = () => {
  return (
    <video className="absolute top-0 left-0 w-full h-full object-cover rounded-[10px]" autoPlay muted loop>
      <source src="assets/bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
