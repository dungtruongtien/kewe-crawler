import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { useToasts } from 'react-toast-notifications';
import { format } from 'date-fns';

import { Header } from '../../components/header';
import KWBreadcrumb from '../../components/breadcumb';
import KWTable from '../../components/table';
import KWPagination from '../../components/pagination';
import FileUpload from '../../components/fileUpload';
import KWProgressBar from '../../components/progressBar';
import { getKeywordCrawlerProcess, listKeywords, uploadKeywords } from '../../services/keyword.service';
import { LIMIT_PER_PAGE, MAXIMUM_FILE_SIZE } from '../../common/constant';

export default function HomePage() {
    const { addToast } = useToasts();
    const [keywords, setKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({ total: 0, currentPage: 1 });
    const [crawlerProcessInfo, setCrawlerProcessInfo] = useState(null);

    useEffect(() => {
        const currentPage = 1;
        handleFetchKeywordData(currentPage);
    }, [])

    const validateFileInput = (file) => {
        if (file.type !== 'text/csv') {
            addToast('File type must be in CSV format', { appearance: 'error', autoDismiss: true });
            return false;
        }

        // validate file size in bytes, 1000000 bytes = 1MB, too large with CSV file with 100 keywords
        if (file.size > MAXIMUM_FILE_SIZE) {
            addToast(`File type must be less than ${MAXIMUM_FILE_SIZE / 1000000}MB`, { appearance: 'error', autoDismiss: true });
            return false;
        }
        return true;
    }

    const processUploadKeyword = (contents) => {
        if (!contents) {
            addToast('Missing file content', { appearance: 'error', autoDismiss: true });
        }
        const rawKeywordArr = contents.split('\n');
        const keywordArr = rawKeywordArr.reduce((total, keyword) => {
            if (keyword) {
                total.push(keyword.replace(/[^a-zA-Z0-9 ]/g, ''));
            }
            return total;
        }, []);
        if (keywordArr.length > 100) {
            addToast('List keywords must be less than 100', { appearance: 'error', autoDismiss: true });
            return null;
        }
        return keywordArr;
    }

    const handleFetchKeywordData = (currentPage) => {
        setIsLoading(false);
        const filter = {
            attributes: 'id,totalAdWordsAdvertisers,totalLinks,htmlStaticLink,keyword,createdAt',
            limit: LIMIT_PER_PAGE,
            page: currentPage
        }
        let filterStr = Object.keys(filter).reduce((total, key) => {
            total += `&${key}=${filter[key]}`;
            return total;
        }, '');
        filterStr = filterStr.replace('&', '');
        listKeywords(filterStr).then(data => {
            setKeywords(data.rows);
            setPageInfo({ totalPagination: Math.ceil(data.count / LIMIT_PER_PAGE), currentPage: parseInt(currentPage) });
            setIsLoading(false);
        });
    }

    const processData = (e) => {
        const file = e.target.files[0];

        if (file) {
            const isValid = validateFileInput(file);
            if (!isValid) {
                e.target.value = null;
                return false;
            }

            // Process CSV file
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;

                // Parse and validate keyword
                const keywordArr = processUploadKeyword(contents);
                if (!keywordArr) {
                    return;
                }
                addToast('Crawler is starting', { appearance: 'success', autoDismiss: true });

                uploadKeywords({ listKeywords: keywordArr }).then(async (data) => {
                    setCrawlerProcessInfo({ processPercentage: 0 });
                    const { trackingKey } = data;
                    //Crawler is delay 5s between each key number. Need to upgrade this approach to get better performance.
                    const intervalTime = 5000;
                    const processInterval = setInterval(async () => {
                        const keywordCrawlerProcess = await getKeywordCrawlerProcess({ trackingKey });
                        //Handle get tracking info success

                        if (!keywordCrawlerProcess || !keywordCrawlerProcess.listKeywords || keywordCrawlerProcess.listKeywords.length === 0) {
                            clearInterval(processInterval);
                            setCrawlerProcessInfo(null);
                            addToast('Crawler is done successfully', { appearance: 'success', autoDismiss: true });
                            setIsLoading(true);
                            e.target.value = null;

                            const currentPage = 1;
                            handleFetchKeywordData(currentPage)

                            return;
                        }

                        // Handle percentage of progress
                        const currentProcessPercentage = Math.ceil(((keywordCrawlerProcess.total - keywordCrawlerProcess.listKeywords.length) / keywordCrawlerProcess.total) * 100);
                        setCrawlerProcessInfo({ processPercentage: currentProcessPercentage });

                    }, intervalTime);
                });
            };
            reader.readAsText(file);
        }
    }

    const handlePopupPreviewHTML = (e) => {
        const popupLink = e.target.value;
        const popupWidth = 1000;
        const popupHeight = 1000;
        const left = (window.innerWidth - popupWidth) / 2;
        const top = (window.innerHeight - popupHeight) / 2;

        // Define the window features, including size and position.
        const features = `width=${1000},height=${1000},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no`;

        window.open(popupLink, 'windowName', features);
    }

    const handleChangePage = (e) => {
        // setIsLoading(true);
        // const currentPage = e.target.getAttribute('value');
        // const filter = {
        //     attributes: 'id,totalAdWordsAdvertisers,totalLinks,htmlStaticLink,keyword,createdAt',
        //     limit: LIMIT_PER_PAGE,
        //     page: currentPage
        // }
        // let filterStr = Object.keys(filter).reduce((total, key) => {
        //     total += `&${key}=${filter[key]}`;
        //     return total;
        // }, '');
        // filterStr = filterStr.replace('&', '');
        // console.log('filterStr-----', filterStr);
        // listKeywords(filterStr).then(data => {
        //     setKeywords(data.rows);
        //     setPageInfo({ totalPagination: Math.ceil(data.count / LIMIT_PER_PAGE), currentPage: parseInt(currentPage) });
        //     setIsLoading(false);
        // });

        const currentPage = e.target.getAttribute('value');
        handleFetchKeywordData(currentPage);
    }

    const tableColumns = [
        {
            data: 'keyword',
            text: 'keyword',
        },
        {
            data: 'totalAdWordsAdvertisers',
            text: 'Total Ads Links',
        },
        {
            data: 'totalLinks',
            text: 'Total Links',
        },
        {
            data: 'createdAt',
            text: 'Crawled Date',
            render: (value) => {
                return format(new Date(value), 'yyyy-MM-dd hh:mm:ss');
            }
        },
        {
            data: 'htmlStaticLink',
            text: 'HTML preview link',
            render: (value) => {
                return <Button variant="primary" onClick={handlePopupPreviewHTML} value={value}>Preview HTML</Button>
            }
        }
    ]

    return (
        <>

            <Header />
            <KWBreadcrumb />
            <div className='kw-table-wrapper'>
                <div className='title'>
                    <h4>KWCrawler Info</h4>
                </div>
                <div className='kw-table'>
                    <div className='file-upload-wrapper'>
                        <FileUpload isDisabled={!!crawlerProcessInfo} processData={processData} />
                    </div>
                    <div style={{ display: crawlerProcessInfo ? 'block' : 'none' }}>
                        <KWProgressBar now={crawlerProcessInfo ? crawlerProcessInfo.processPercentage : 0} />
                    </div>
                    <KWTable isLoading={isLoading} columns={tableColumns} data={keywords} />
                </div>
                <div className='kw-pagination-wrapper'>
                    <KWPagination pageInfo={pageInfo} handleChangePage={handleChangePage} />
                </div>
            </div>
        </>
    )
}
