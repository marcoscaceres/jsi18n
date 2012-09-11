************ HHoowwddyy ************
This script "patches" Google Chrome's implementation of the i18n API so that it
conforms more fully with ECMAScript's Internationalization API. In particular
it makes Dates.prototype.toLocale[Date,Time]String(),
String.prototype.localeCompare(), and Number.prototype.toLocaleString() work as
defined by the ECMAScript Internationalization specification.
************ HHooww ttoo uussee iitt ************
Note that this script is not meant for production environments. It's just meant
to give you a taste of what the API will be able to do once it becomes more
widely adopted by browsers and other JS-enabled environments, like Node.js.

<script src="https://raw.github.com/marcoscaceres/jsi18n/master/
jsi18n_patch.js">
</script>
Simple usage examples:
//dates
date = new Date();
date.toLocaleString("en-us", {weekday: 'long'}); //returns Monday
date.toLocaleTimeString("ar");    //returns time in arabic

//numbers
(123456).toLocaleString("en-us"); //returns "123,456"

//currencies
(123456).toLocaleString("ar", {style: "currency", currency: "USD"});
//returns "US$� ١٢٣٬٤٥٦٫� � "
********** FFoouunndd aa bbuugg?? wwaanntt ttoo ccoonnttrriibbuuee **********
Please contribute to our _i_s_s_u_e_s_ _p_a_g_e on Github.
********** WWaannnnaa kknnooww mmoorree?? **********
We have created some detailed documentation on _h_o_w_ _t_o_ _u_s_e_ _t_h_e_ _J_a_v_a_S_c_r_i_p_t
_I_n_t_e_r_n_a_t_i_o_n_a_l_i_z_a_t_i_o_n_ _A_P_I.
Felling like a pro? See also _t_h_e_ _E_C_M_A_S_c_r_i_p_t_ _I_n_t_e_r_n_a_t_i_o_n_a_l_i_z_a_t_i_o_n_ _A_P_I_ _s_p_e_c_s
