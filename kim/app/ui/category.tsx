'use client'
import { useEffect, useState } from 'react';


interface Category {
  cateName : string
}

export default function Category(){
  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/category') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('카테고리 데이터를 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setCategory(data); 
      })
      .catch((error) => {
        console.error('Error fetching category:', error);
      });
  }, []);
  return(
    <ul className = "flex justify-around bg-gray-300">
        {category.map((category, index) => (
          <li className = 'flex justify-center w-20 h-10 items-center bg-gray-300 hover:bg-slate-200 cursor-pointer' key={index}>{category.cateName}</li>
        ))}
    </ul>
  )
}