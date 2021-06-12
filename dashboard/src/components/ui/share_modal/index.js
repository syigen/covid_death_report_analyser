import { useEffect, useState } from "react";
import { FacebookIcon, FacebookShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

const ShareModal = ({ close, rawData }) => {
    const [data, setData] = useState();
    useEffect(() => {
        if (rawData) {
            const data = rawData.about_report;
            setData(data);
        }
    }, [rawData])
    return (
        <> {data && <div className={" fixed w-full h-full top-0 left-0 flex items-center justify-center"}>
            <div class="absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div class="py-4 text-left px-6  bg-gray-900 text-blue-50 z-50 w-10/12 lg:w-4/12">
                <div class="flex justify-between items-center pb-3">
                    <p class="text-2xl font-bold text-gray-50">Share</p>
                    <div class="cursor-pointer z-50" onClick={close}>
                        <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                    </div>
                </div>

                <div class="flex flex-row gap-2">
                    <div className="Demo__some-network">
                        <FacebookShareButton
                            url={process.env.REACT_APP_PUBLIC_URL}
                            quote={process.env.REACT_APP_DESCRIPTION}
                            className="Demo__some-network__share-button"
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <div className="Demo__some-network__share-count">&nbsp;</div>
                    </div>
                    <div className="Demo__some-network">
                        <TwitterShareButton
                            url={process.env.REACT_APP_PUBLIC_URL}
                            quote={process.env.REACT_APP_DESCRIPTION}
                            className="Demo__some-network__share-button"
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>

                        <div className="Demo__some-network__share-count">&nbsp;</div>
                    </div>

                    <div className="Demo__some-network">
                        <TelegramShareButton
                            url={process.env.REACT_APP_PUBLIC_URL}
                            quote={process.env.REACT_APP_DESCRIPTION}
                            className="Demo__some-network__share-button"
                        >
                            <TelegramIcon size={32} round />
                        </TelegramShareButton>

                        <div className="Demo__some-network__share-count">&nbsp;</div>
                    </div>

                    <div className="Demo__some-network">
                        <WhatsappShareButton
                            url={process.env.REACT_APP_PUBLIC_URL}
                            quote={process.env.REACT_APP_DESCRIPTION}
                            separator=":: "
                            className="Demo__some-network__share-button"
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>

                        <div className="Demo__some-network__share-count">&nbsp;</div>
                    </div>
                </div>
                <p>
                    Share with your firends
                </p>

                <div class="flex justify-end pt-2">
                    <button
                        onClick={close}
                        class="px-4 bg-indigo-500 p-3 rounded-lg
                         text-white hover:bg-indigo-400">Close</button>
                </div>

            </div>
        </div>
        }
        </>
    )
}

export default ShareModal;