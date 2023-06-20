const CheckBoxOff = ({color}) => {
    return(
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_330_8814)">
            <path d="M11.4286 8C9.53771 8 8 9.53771 8 11.4286V28.5714C8 30.4623 9.53771 32 11.4286 32H28.5714C30.4623 32 32 30.4623 32 28.5714V11.4286C32 9.53771 30.4623 8 28.5714 8H11.4286ZM11.4286 28.5714V11.4286H28.5714L28.5749 28.5714H11.4286Z" fill={color}/>
            </g>
            <defs>
            <clipPath id="clip0_330_8814">
                <rect width="40" height="40" fill="white"/>
            </clipPath>
            </defs>
        </svg>
    )
}

export default CheckBoxOff;