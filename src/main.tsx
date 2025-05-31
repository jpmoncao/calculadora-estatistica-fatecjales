import './index.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import Header from '@/components/common/header'
import Home from '@/pages/home'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />

    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>

    <footer className='w-full h-8 bg-background border-t-2 border-primary text-primary text-center'>
      Desenvolvido por <a className='text-primary/70 hover:underline hover:text-primary/50 transition-all' rel='noopener' href='https://github.com/arthur-risso' target='_blank'>Arthur Risso</a> e <a className='text-primary/70 hover:underline hover:text-primary/50 transition-all' rel='noopener' href='https://github.com/jpmoncao' target='_blank'>João Pedro Monção</a>
    </footer>
  </BrowserRouter>,
)

