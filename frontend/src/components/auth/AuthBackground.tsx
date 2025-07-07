import React from 'react';

export const AuthBackground: React.FC = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* 3D Wave Effect */}
        <div className="absolute inset-0 opacity-90">
          <img src='/container.png' alt='container-img' />
        </div>
        
        {/* Additional 3D effect layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-800/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"></div>
        
        {/* Floating elements for extra depth */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-300/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};