import Image from "next/image"

const LogoFilled = ({
  width = 75,
  height = 74,
  className = "",
  imageClass = "w-[4.688rem] h-auto"
}: {
  width?: number
  height?: number,
  className?: string,
  imageClass?: string
}) => {
  return (
  <span className={`${className} select-none flex flex-nowrap gap-3 md:gap-3 items-center text-brand mt-0 md:mt-4`}>
    <Image
      src="/assets/icons/logo-brand.svg"
      alt="logo"
      width={width}
      height={height}
      className={imageClass}
      draggable={false}
    />
    
    <span className="text-[2rem] md:text-[2.125rem] font-medium leading-[3.5rem]">
      Racky
    </span>
  </span>
)
}

export default LogoFilled
