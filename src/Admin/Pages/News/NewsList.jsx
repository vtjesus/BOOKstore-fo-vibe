import React from 'react';
import { Link } from 'react-router-dom';

import { GrArticle } from 'react-icons/gr';

import titleCSS from '../../../Styles/db_title.module.css';
import newsCSS from './news.module.css';
import NewsCard from './NewsCard';
import { Axios, GetNews } from '../../../API/Api';
import { useQuery } from 'react-query';
import { ThreeCircles } from 'react-loader-spinner';

export default function NewsList() {

    // ====== get-all-news ====== //

    const token = localStorage.getItem('token');

    const getAllNews = async() => {

        return await Axios.get(`${GetNews}` , {headers: {token}});

    }

    const {data , isLoading} = useQuery('getAllNews' , getAllNews);

    const news = data?.data.data;

    return <React.Fragment>

        <div className={titleCSS.container}>

            <div className={titleCSS.title}>

                <div className={titleCSS.title_box}>

                    <GrArticle />
                    <p>News</p>

                </div>

                <div className={titleCSS.actions}>

                    <Link to={'add'}>Add News</Link>

                </div>

            </div>

            {isLoading ? 
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <ThreeCircles
                            visible={true} height="50" width="50" color="var(--active-color)"
                            ariaLabel="three-circles-loading" wrapperStyle={{}} wrapperClass=""
                        />
                    </div>: <div className={newsCSS.container}>

                    {news.map( news => <NewsCard key={news._id} news={news} />)}

                </div>
            }

        </div>

    </React.Fragment>

}
