import React, { useEffect, useState } from 'react';

import newsCardCSS from './news.module.css';
import { MdDeleteOutline } from 'react-icons/md';
import { Axios, NewsDelete } from '../../../API/Api';
import { AnimatePresence } from 'framer-motion';
import Warning from '../../../Components/Common/Warning/Warning';
import Status from '../../../Components/Common/Status/Status';

export default function NewsCard({news , refetch}) {

    const dateStr = news.date;
    const date = new Date(dateStr);
    const options = { month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(/\//g, '-');

    // ====== delete-news ====== //

    const token = localStorage.getItem('token');

    const [displayWarn, setDisplayWarn] = useState(false);
    const [newsData, setNewsData] = useState(null);
    const [deleteNews, setDeleteNews] = useState(null);

    const [errMsg, setErrMsg] = useState(null);
    const [visible, setVisible] = useState(true);
    const [successMsg, setSuccessMsg] = useState(null);

    const deleteNewsFS = () => {

        setDisplayWarn(true);
        setNewsData(news);

    }

    useEffect(() => {

        const deleteNewsById = async() => {
            if(deleteNews){

                setErrMsg(null);
                setSuccessMsg(null);

                try {

                    const {data} = await Axios.delete(`${NewsDelete}/${deleteNews}` , {headers: {token}});
                    if(data.success){

                        setDeleteNews(null);
                        setDisplayWarn(false);
                        setNewsData(null);
                        setSuccessMsg(data.message);
                        refetch();

                    }

                } catch (error) {
                    setErrMsg(error);
                }
            }
        }

        deleteNewsById();

    } , [deleteNews , token , refetch]);

    // ====== check-for-links ====== //

    const [formattedDescription, setFormattedDescription] = useState(null);

    useEffect(() => {

        if(news){
            
            const regex = /\{([^,]+),\s*(https?:\/\/[^\s]+)\}/ || /\{([^,]+) ,\s*(https?:\/\/[^\s]+)\}/;

            setFormattedDescription(news.description.replace(regex, (match, text, url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
            }));

        }

    } , [news]);

    return <React.Fragment>

        <AnimatePresence>
            {displayWarn && 
                <Warning
                    cancel={setDisplayWarn}
                    setDeleteData={setDeleteNews}
                    deleteData={deleteNews}
                    data={newsData}
                />
            }
        </AnimatePresence>

        {successMsg ? <Status icon='success' isVisible={visible} visibility={setVisible} data={successMsg} /> : ''}
        {errMsg ? <Status icon='error' isVisible={visible} visibility={setVisible} data={errMsg} /> : ''}

        <div className={newsCardCSS.card}>

            <div className={newsCardCSS.actions}>

                <button onClick={deleteNewsFS}><MdDeleteOutline /></button>

            </div>

            <div className={newsCardCSS.title}>

                <h3>{news.title}</h3>

                <p className={newsCardCSS.date}>{formattedDate}</p>

            </div>

            <div dangerouslySetInnerHTML={{ __html: formattedDescription }} className={newsCardCSS.content}></div>

        </div>

    </React.Fragment>

}
