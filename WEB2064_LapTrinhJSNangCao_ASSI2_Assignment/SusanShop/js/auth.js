import { UserAPI } from "./api/users.js";
import { $, toast } from "./utils.js";

const LS_SESSION = "susan_session_user";

export const Auth = {
  current(){
    try{ return JSON.parse(localStorage.getItem(LS_SESSION)); }catch{return null}
  },
  setSession(u){
    localStorage.setItem(LS_SESSION, JSON.stringify({id:u.id, name:u.name, email:u.email, role:u.role||"user"}));
  },
  clear(){ localStorage.removeItem(LS_SESSION); },
  logout(){ this.clear(); },
  async login(email, password){
    const rows = await UserAPI.findByEmail(email);
    const u = rows.find(r => String(r.password||"") === String(password));
    if(!u) throw new Error('Sai email hoac mat khau');
    this.setSession(u); return u;
  },
  async register(payload){
    const existed = await UserAPI.findByEmail(payload.email);
    if(existed.length) throw new Error('Email da ton tai');
    payload.role = 'user';
    return await UserAPI.create(payload);
  }
};

export function bindLogin(){
  const form = $('#loginForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = $('#email').value.trim().toLowerCase();
    const password = $('#password').value;
    try{
      const u = await Auth.login(email, password);
      toast('Dang nhap thanh cong');
      setTimeout(()=> location.href = (u.role==='admin'?'admin/index.html':'index.html'), 600);
    }catch(err){ toast(err.message || 'Dang nhap that bai'); }
  });
}

export function bindRegister(){
  const form = $('#registerForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      name: $('#name').value.trim(),
      email: $('#email').value.trim().toLowerCase(),
      password: $('#password').value,
      phone: $('#phone').value.trim(),
      address: $('#address').value.trim(),
      role: 'user'
    };
    try{
      await Auth.register(payload);
      toast('Dang ky thanh cong, vui long dang nhap');
      setTimeout(()=> location.href='login.html', 800);
    }catch(err){ toast(err.message || 'Dang ky that bai'); }
  });
}

export function requireAdmin(){
  const u = Auth.current();
  if(!u || u.role!=='admin'){ location.href = '../login.html'; }
}
