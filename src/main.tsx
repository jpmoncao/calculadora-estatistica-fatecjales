import './index.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'

import Header from '@/components/common/header'
import Home from '@/pages/home'
import About from '@/pages/about'
import NotFound from '@/pages/not-found'
import IntervaloCobranca from '@/pages/calculators/intervalo-confianca'
import TamanhoAmostra from '@/pages/calculators/tamanho-amostra'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/calculadora-intervalo-confianca" element={<IntervaloCobranca />} />
      <Route path="/calculadora-tamanho-amostra" element={<TamanhoAmostra />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

    <Toaster />

    <footer className='w-full h-8 bg-background border-t-2 border-primary text-primary text-center'>
      Desenvolvido por <a className='text-primary/70 hover:underline hover:text-primary/50 transition-all' rel='noopener' href='https://github.com/arthur-risso' target='_blank'>Arthur Risso</a> e <a className='text-primary/70 hover:underline hover:text-primary/50 transition-all' rel='noopener' href='https://github.com/jpmoncao' target='_blank'>João Pedro Monção</a>
    </footer>
  </BrowserRouter>,
)

