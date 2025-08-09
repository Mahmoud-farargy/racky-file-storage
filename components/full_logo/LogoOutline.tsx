import Image from "next/image"

const LogoOutline = ({
  width = 75,
  height = 74,
  className,
  imageClass = "w-[4.688rem] h-auto",
}: {
  width?: number
  height?: number
  className?: string
  imageClass?: string
}) => {
  return (
    <span
      className={`${className} select-none flex flex-nowrap gap-3 xl:gap-3 items-center text-white mt-4 xl:mt-4`}
    >
      <Image
        src="/assets/icons/logo1.svg"
        alt="logo"
        width={width}
        height={height}
        className={imageClass}
      />
      <span className="text-[2rem] xl:text-[2.125rem] font-medium leading-[3.5rem]">
        Racky
      </span>
    </span>
  )
}

export default LogoOutline
