<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment - Print</title>
        <style>
           @media print{
                body {
                    display: block;
                    width: 794px;
                    height: 1123px;
                    margin:auto;
                    border:1px solid #000;
                    background: white;
                    padding: 20px;
                }

                h1 {
                    color: rgb(238, 105, 34);
                    margin-bottom: 3px;
                    margin-top: 3px;
                }

                hr {
                    border: none;
                    height: 4px;
                    background-color: orange;
                    width: 100%;
                }

                .main-text {
                    font-size: 22px;
                    font-weight: 500;
                }
                img {
                    display: block;
                    max-width: 5rem;
                    height: auto;
                }
            }
        </style>
    </head>
   <body>

        {{-- other interior styles --}}
        
        <div
            style="width: 794px; height: 1123px; margin: auto; border: 1px solid #000; position: relative; background: white; padding: 20px;">

        {{-- header things --}}
            <header style="text-align: center;">
                <h1>ቴዲ የአሽከርካሪዎች ማሰልጠኛ ማእከል</h1>
                <h1>TEDDY DRIVING LICENSE CENTER</h1>

                <hr>
                <p style="margin: 0; padding: 0; line-height:1.5; font-size: 18px; font-weight:bold;">
                    Lemi Kura subcity, woreda 08, House No. New, Tel: 0913152319
                </p>
                <hr>
            </header>


            {{-- image and date --}}
            <section style="display:flex; justify-content:space-between; align-items: flex-start; margin-bottom:20px;">
                <div>
                    {{-- todo: retrieve image from db  --}}
                    <img src="{{ asset('uploads/users/' . 'hp.jpg') }}" alt="applicant image">
                </div>
                <div style="text-align: right; margin-bottom: 20px;">
                    <p><strong>ቀን: 28/04/2017</strong></p>
                    <p><strong>የደብዳቤ ቁጥር: ቴ/አ/ማ//00374/17</strong></p>
                </div>
            </section>


            <main style="text-align: left; margin-bottom: 20px;">
                <h3 style="text-align: center; text-decoration:underline">ጉዳዩ፦ ለመንጃ ፈቃድ ስልጠና የጤና ምርመራ ማድረግን ይመለከታል
                </h3>

                {{-- Main body part --}}
                <p class="main-text">
                    አቶ/ወሮ/ወት <strong>John Doe</strong> የምዝገባ ቁጥር <strong>987654321</strong>
                    መታወቂያ ቁጥር
                    <strong>123456789</strong> ስማቸው ከላይ የተገለጹት ግለሰብ በማሰልጠኛ ተቋማችን የ የአሽከርካሪ ብቃት ማረጋገጫ
                    እንዲሰጣቸው ጥያቄ አቅርበዋል።
                </p>
                <p class="main-text">
                    በዚህም መሰረት በአሽከርካሪ ብቃት ማረጋገጫ አዋጅ ቁጥር 72/2000 ዓ.ም አንቀጽ 11 ንዑስ አንቀጽ 1 በተደነገገው መሰረት አመልካች የባለ ሞተር
                    ተሽከርካሪ በሚገባ ለማንቀሳቀስ ከሚያውክ ማንኛውም የአካል ጉዳት አይነት ወይም የጤና መታወክ ነጻ መሆን አለበት በማለት ያዛል ።
                </p>

                <p class="main-text">
                    ስለዚህም ከላይ በተጠቀሰው በአሽከርካሪ ብቃት ማረጋገጫ ፈቃድ (መንጃ ፈቃድ) አስፈላጊውን የጤና ምርመራ ተድርጎላቸው ሞተር ተሽከርካሪ ለማሽከርከር
                    ጤንነታቸው ብቁ ያደርጋቸው እንደሆነ እና የደም ዓይነት(Blood Type) ተጠቅሶ በሸኚ ደብዳቤ እንዲጻፍላቸው እንጠይቃለን ።
                </p>
                <p style="text-align: right; font-weight:500; margin-right:20px;">ከሰላምታ ጋር</p>
                <br>


                <div style="margin-top: 20px; display:flex; justify-content:space-between">
                    <p style="font-size: 20px">
                        <strong>የአመልካች ፊርማ</strong> <span
                            style="border-bottom: 2px solid grey; display: inline-block; width: 150px;"></span>
                    </p>

                    <p style="font-size: 20px">
                        <strong>የሰልጣኝ ፊርማ</strong> <span
                            style="border-bottom: 2px solid grey; display: inline-block; width: 150px;"></span>
                    </p>
                </div>

            </main>
            <footer>
                <p>
                    <strong>ጥብቅ ማሳሰቢያ፦</strong>
                <ul>
                    <li>የምርመራ ውጤቱ ደብዳቤው ወጪ ከሆነበት ቀን ጀምሮ ከ 2 ቀን በላይ ቢመጣ ተቀባይነት አይኖረውም።
                    </li>
                    <li>
                        ለምርመራ ሲሄዱ አንድ ጉርድ ፎቶግራፍ መያዝዎትን አይርሱ።
                    </li>
                </ul>
                </p>
            </footer>
        </div>
    <script>
        // Trigger the print
        window.onload = function() {
            window.print();
        };
    </script>
   </body>
</html>
