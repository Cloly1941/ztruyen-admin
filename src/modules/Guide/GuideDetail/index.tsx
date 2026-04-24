
type TGuideDetail = {
    guideId: string;
}

const GuideDetail = ({guideId}: TGuideDetail) => {
    return (
        <div>{guideId}</div>
    )
}

export default GuideDetail